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
    Select, MenuItem,
    FormControl,
    InputLabel,
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

const ATTACK_TYPES = {
    "attack-enterprise": "MITRE ATT&CK Enterprise",
    "attack-ics": "MITRE ATT&CK ICS",
    "attack-mobile": "MITRE ATT&CK Mobile",
    "capec": "MITRE CAPEC",
    "cwe": "MITRE CWE",
    "disarm": "DISARM",
    "atlas": "MITRE ATLAS",
    "location": "Location"
};

const ATTACK_ID_FIELDS = {
    "attack-enterprise": {
        name: 'attack_id',
        label: 'ATT&CK ID'
    },
    "attack-ics": {
        name: 'attack_id',
        label: 'ATT&CK ID'
    },
    "attack-mobile": {
        name: 'attack_id',
        label: 'ATT&CK ID'
    },
    "capec": {
        name: 'capec_id',
        label: 'CAPEC ID'
    },
    "cwe": {
        name: 'cwe_id',
        label: 'CWE ID'
    },
    "disarm": {
        name: 'disarm_id',
        label: 'DISARM ID'
    },
    "atlas": {
        name: 'atlas_id',
        label: 'ATLAS ID'
    },
    "location": undefined,
};

const OBJECT_TYPE_FILTERS = {
    "attack-enterprise": {
        name: 'attack_type',
        options: [
            { name: 'Asset', value: '' },
            { name: 'Campaign', value: '' },
            { name: 'Data Component', value: '' },
            { name: 'Data Source', value: '' },
            { name: 'Group', value: '' },
            { name: 'Mitigation', value: '' },
            { name: 'Software', value: '' },
            { name: 'Sub-technique', value: '' },
            { name: 'Tactic', value: '' },
            { name: 'Technique', value: '' },
        ],
    },
    "attack-ics": {
        name: 'attack_type',
        options: [
            { name: 'Asset', value: '' },
            { name: 'Campaign', value: '' },
            { name: 'Data Component', value: '' },
            { name: 'Data Source', value: '' },
            { name: 'Group', value: '' },
            { name: 'Mitigation', value: '' },
            { name: 'Software', value: '' },
            { name: 'Sub-technique', value: '' },
            { name: 'Tactic', value: '' },
            { name: 'Technique', value: '' },
        ],
    },
    "attack-mobile": {
        name: 'attack_type',
        options: [
            { name: 'Asset', value: '' },
            { name: 'Campaign', value: '' },
            { name: 'Data Component', value: '' },
            { name: 'Data Source', value: '' },
            { name: 'Group', value: '' },
            { name: 'Mitigation', value: '' },
            { name: 'Software', value: '' },
            { name: 'Sub-technique', value: '' },
            { name: 'Tactic', value: '' },
            { name: 'Technique', value: '' },
        ],
    },
    "capec": undefined,
    "cwe": undefined,
    "disarm": {
        name: 'disarm_type',
        options: [
            { name: 'Sub-technique', value: '' },
            { name: 'Tactic', value: '' },
            { name: 'Technique', value: '' },
        ],
    },
    "atlas": {
        name: 'atlas_type',
        options: [
            { name: 'Mitigation', value: '' },
            { name: 'Sub-technique', value: '' },
            { name: 'Tactic', value: '' },
            { name: 'Technique', value: '' },
        ],
    },
    "location": {
        name: 'location_type',
        options: [
            { name: 'country', value: '' },
            { name: 'intermediate-region', value: '' },
            { name: 'region', value: '' },
            { name: 'sub-region', value: '' },
        ],
        multiple: true,
    },
}

function MitreAttackListPage() {
    const [objects, setObjects] = useState<Attack[]>([])
    const [page, setPage] = useState(0)
    const [totalResultsCount, setTotalResutsCount] = useState(0)
    const [filter, setFilter] = useState({
        name: '',
        description: '',
    })
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [sortField, setSortField] = useState<string>('created');
    const [loading, setLoading] = useState(false)
    const [dataLoadIndex, setDataLoadIndex] = useState(0)
    const [idFilter, setIdFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState<string[]>([])
    const location = useLocation();
    const { attackType } = useParams<{ attackType: string }>()

    const setFiltersAndLoadData = async () => {
        const query = new URLSearchParams(location.search);
        setIdFilter(query.get(ATTACK_ID_FIELDS[attackType]?.name) || '')
        setTypeFilter(query.get(OBJECT_TYPE_FILTERS[attackType]?.name)?.split(',') || [])
        setFilter({
            name: query.get('name') || '',
            description: query.get('description') || '',
        })
        setDataLoadIndex(dataLoadIndex + 1)
    }
    useEffect(() => {
        setFiltersAndLoadData()
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
        if (str?.length > limit) {
            return str.substring(0, limit) + '...';
        }
        return str;
    }


    const loadData = async () => {
        setLoading(true)
        const queryFilter = {
            ...filter,
        }
        if (ATTACK_ID_FIELDS[attackType]) {
            queryFilter[ATTACK_ID_FIELDS[attackType].name] = idFilter
        }
        if (OBJECT_TYPE_FILTERS[attackType]) {
            queryFilter[OBJECT_TYPE_FILTERS[attackType].name] = typeFilter
        }
        updateURLWithParams(queryFilter)
        const res = await fetchAttackEnterprises(attackType, queryFilter, page, sortField + (sortOrder === 'asc' ? '_ascending' : '_descending'))
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
            capec: "capec",
            location: "location2stix",
        }
        const refernceName = idReferenceNameDict[attackType] || 'mitre-attack'
        const id = object.external_references?.find(reference => reference.source_name === refernceName)?.external_id
        return id
    }

    useEffect(() => {
        if (!dataLoadIndex) return
        loadData()
    }, [page, dataLoadIndex])

    useEffect(() => {
        document.title = `${ATTACK_TYPES[attackType]} | CTI Butler`
    }, [attackType])


    return (
        <Container>
            <Typography variant="h4">{ATTACK_TYPES[attackType]}</Typography>
            <Typography className="description">
                <p>Search and filter objects.</p>
            </Typography>
            <Grid2 container spacing={2}>
                {ATTACK_ID_FIELDS[attackType] && <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <TextField
                            label={ATTACK_ID_FIELDS[attackType]?.label}
                            value={idFilter} onChange={(ev) => setIdFilter(ev.target.value)}
                        ></TextField>
                    </Box>
                </Grid2>}
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

                {OBJECT_TYPE_FILTERS[attackType] && <Grid2 size={4}>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                        <Select
                            value={typeFilter}
                            label="Type"
                            sx={{ flex: 'auto' }}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            multiple={OBJECT_TYPE_FILTERS[attackType].multiple}
                        >
                            {OBJECT_TYPE_FILTERS[attackType].options.map((option) =>
                                <MenuItem key={option.name} value={option.name}>{option.name}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid2>}

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
