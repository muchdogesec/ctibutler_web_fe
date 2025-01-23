import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table, TableHead, TableRow, TableBody, TableCell,
    Box,
    TextField,
    Grid2,
    Button,
    TableContainer,
    TablePagination,
    CircularProgress,
    Select,
    MenuItem
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { URLS } from "../../../services/urls.ts";
import { fetchAttackEnterprises } from "../../../services/ctibutler_api.ts";


type Attack = {
    type: "marking-definition";
    id: string;
    name: string;
    description: string;
    created: string; // ISO 8601 format
    created_by_ref: string;
    definition: {
        statement: string;
    };
    definition_type: "statement";
    object_marking_refs: string[];
    spec_version: "2.1";
};

const ATTACK_TYPES = [
    { name: "MITRE ATT&CK Enterprise", value: 'attack-enterprise' },
    { name: "MITRE ATT&CK ICS", value: 'attack-ics' },
    { name: "MITRE ATT&CK Mobile", value: 'attack-mobile' },
    { name: "MITRE CAPEC", value: 'capec' },
    { name: "MITRE CWE", value: 'cwe' },
    { name: "DISARM", value: 'disarm' },
    { name: "MITRE ATLAS", value: 'atlas' },
    { name: "Location", value: 'location' },
];

function MitreAttackListPage() {
    const [objects, setObjects] = useState<Attack[]>([])
    const [page, setPage] = useState(0)
    const [totalResultsCount, setTotalResutsCount] = useState(0)
    const [filter, setFilter] = useState({
        name: '',
        attack_id: '',
        description: '',
        type: '',
        weakness_id: '',
        capec_id: '',
        attack_type: 'attack-enterprise',
    })
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [sortField, setSortField] = useState<string>('created');
    const [loading, setLoading] = useState(false)
    const [initialDataLoaded, setInitialDataLoaded] = useState(false)
    const location = useLocation();
    const [attackType, setAttackType] = useState('attack-enterprise')

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setFilter({
            name: query.get('name') || '',
            attack_id: query.get('attack_id') || '',
            description: query.get('description') || '',
            type: query.get('type') || '',
            weakness_id: query.get('weakness_id') || '',
            capec_id: query.get('capec_id') || '',
            attack_type: query.get('attack_type') || 'attack-enterprise',
        })
        if(initialDataLoaded) loadData()
        setInitialDataLoaded(true)
    }, [location])


    const setFilterField = (fieldName: string, value: string) => {
        setFilter((filer) => ({ ...filter, [fieldName]: value }))
    }

    const handleSortChange = (field: string) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
        setPage(0);
        loadData()
    };

    const updateURLWithParams = (params) => {
        const queryString = new URLSearchParams(params).toString();
        const newURL = `${window.location.pathname}?${queryString}`;
        window.history.pushState(null, "", newURL);
    };

    function limitCharacters(str, limit = 512) {
        if (str.length > limit) {
            return str.substring(0, limit) + '...';
        }
        return str;
    }


    const loadData = async () => {
        setLoading(true)
        setAttackType(filter.attack_type)
        updateURLWithParams(filter)
        const res = await fetchAttackEnterprises(filter.attack_type, filter, page, sortField + (sortOrder === 'asc' ? '_ascending' : '_descending'))
        setObjects(res.data.objects.filter(item => !['identity', 'marking-definition', 'x-mitre-matrix', 'x-mitre-collection'].includes(item.type)))
        setTotalResutsCount(res.data.total_results_count)
        setLoading(false)
    }

    const filterObjects = async () => {
        setPage(0)
        loadData()
    }

    const getAtlasID = (object) => {
        const idReferenceNameDict = {
            disarm: "DISARM",
            atlas: "mitre-atlas",
            cwe: "cwe",
            capec: "capec"
        }
        const refernceName = idReferenceNameDict[attackType] || 'mitre-attack'
        const id = object.external_references?.find(reference => reference.source_name === refernceName)?.external_id
        return id
    }

    useEffect(() => {
        if (!initialDataLoaded) return
        loadData()
    }, [page, initialDataLoaded])

    useEffect(() => {
        document.title = `Knowledgebase Search | CTI Butler`
    }, [])


    return (
        <Container>
            <Typography variant="h4">Knowledgebase Search</Typography>
            <Typography className="description">
              <p>Use this page to explore and filter the knowledgebases.</p>
            </Typography>

            <Grid2 container spacing={2}>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>

                        <Select
                            value={filter.attack_type}
                            label="Type"
                            onChange={(ev) => setFilterField('attack_type', ev.target.value)}
                        >

                            <MenuItem key='attack-enterprise' value='attack-enterprise'>MITRE ATT&CK Enterprise</MenuItem>

                            <MenuItem key='attack-ics' value='attack-ics'>MITRE ATT&CK ICS</MenuItem>
                            <MenuItem key='attack-mobile' value='attack-mobile'>
                                MITRE ATT&CK Mobile
                            </MenuItem>
                            <MenuItem key='capec' value='capec'>
                                MITRE CAPEC
                            </MenuItem>
                            <MenuItem key='cwe' value='cwe'>
                                MITRE CWE
                            </MenuItem>
                            <MenuItem key='disarm' value='disarm'>
                                DISARM
                            </MenuItem>
                            <MenuItem key='atlas' value='atlas'>
                                MITRE ATLAS
                            </MenuItem>
                            <MenuItem key='location' value='location'>
                                Location
                            </MenuItem>

                        </Select>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <TextField
                            label="ATT&CK ID"
                            value={filter.attack_id} onChange={(ev) => setFilterField('attack_id', ev.target.value)}
                        ></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <TextField
                            label="Object Name"
                            variant="outlined"
                            value={filter.name} onChange={(ev) => setFilterField('name', ev.target.value)}>
                        </TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <TextField label="Description" value={filter.description} onChange={(ev) => setFilterField('description', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField label='Object Type' value={filter.type} onChange={(ev) => setFilterField('type', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Button onClick={() => filterObjects()} variant="contained">Filter</Button>
                    </Box>
                </Grid2>
            </Grid2>

            <TableContainer>

                <Typography sx={{ marginTop: '1rem' }} variant="h5">Results</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Object Name</TableCell>
                            <TableCell onClick={() => handleSortChange('created')} style={{ cursor: 'pointer' }}>
                                Description
                                {sortField === 'created' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </TableCell>
                            <TableCell onClick={() => handleSortChange('cvss_base_score')} style={{ cursor: 'pointer' }}>
                                Object Type
                                {sortField === 'cvss_base_score' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </TableCell>
                            <TableCell onClick={() => handleSortChange('cvss_base_score')} style={{ cursor: 'pointer' }}>
                                Knowledgebase Name
                                {sortField === 'cvss_base_score' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                                        Loading...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (<>
                            {objects.map(object => <TableRow key={object.id}>
                                <TableCell><Link to={URLS.attackDetailPage(attackType || '', getAtlasID(object))}>{getAtlasID(object)}</Link></TableCell>
                                <TableCell>{object.name}</TableCell>
                                <TableCell>{limitCharacters(object.description)}</TableCell>
                                <TableCell>{object.type}</TableCell>
                                <TableCell>{object.type}</TableCell>
                            </TableRow>)}
                        </>)}

                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[]}
                    count={totalResultsCount}
                    page={page}
                    rowsPerPage={50}
                    onPageChange={(ev, value) => setPage(value)}
                    color="primary"
                    style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                />
            </TableContainer>
        </Container >
    );
}

export default MitreAttackListPage;
