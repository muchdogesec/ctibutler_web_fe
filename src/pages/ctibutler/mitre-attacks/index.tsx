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
    CircularProgress
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { URLS } from "../../../services/urls.ts";
import { getDateString } from "../../../services/utils.ts";
import { fetchAttackEnterprises } from "../../../services/ctibutler_api.ts";


type Attack = {
    type: "marking-definition";
    id: string;
    created: string; // ISO 8601 format
    created_by_ref: string;
    definition: {
      statement: string;
    };
    definition_type: "statement";
    object_marking_refs: string[];
    spec_version: "2.1";
  };

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
    })
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [sortField, setSortField] = useState<string>('created');
    const [loading, setLoading] = useState(false)
    const [initialDataLoaded, setInitialDataLoaded] = useState(false)
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setFilter({
            name: query.get('name') || '',
            attack_id: query.get('attack_id') || '',
            description: query.get('description') || '',
            type: query.get('type') || '',
            weakness_id: query.get('weakness_id') || '',
            capec_id: query.get('capec_id') || '',
        })
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

    const loadData = async () => {
        setLoading(true)
        updateURLWithParams(filter)
        const res = await fetchAttackEnterprises(filter, page, sortField + (sortOrder === 'asc' ? '_ascending' : '_descending'))
        setObjects(res.data.objects)
        setTotalResutsCount(res.data.total_results_count)
        setLoading(false)
    }

    const filterObjects = async () => {
        setPage(0)
        loadData()
    }

    const getAtlasID = (object) => {
        console.log(object, object.external_references)
        return object.external_references?.find(reference => reference.source_name === 'mitre-attack')?.external_id
    }

    useEffect(() => {
        if (!initialDataLoaded) return
        loadData()
    }, [page, initialDataLoaded])

    useEffect(() => {
        document.title = `Mitre Att&cks | CTI Butler`
    }, [])


    return (
        <Container>
            <Typography variant="h4" > MITRE ATT&CK Enterprise </Typography>
            <Grid2 container spacing={2}>
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
                {/* <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField label="Knowledgebase name" value={filter.type} onChange={(ev) => setFilterField('type', ev.target.value)}></TextField>
                    </Box>
                </Grid2> */}
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
                                <TableCell><Link to={URLS.attackDetailPage(getAtlasID(object))}>{getAtlasID(object)}</Link></TableCell>
                                <TableCell>{object.name}</TableCell>
                                <TableCell>{object.description}</TableCell>
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
