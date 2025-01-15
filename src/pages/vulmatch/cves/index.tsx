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
import { APP_TITLE } from "../../../config.ts";
import { fetchCves } from "../../../services/vulmatch_api.ts";
import { Link, useLocation } from "react-router-dom";
import { URLS } from "../../../services/urls.ts";
import { getDateString } from "../../../services/utils.ts";


type CVE = {
    id: string,
    name: string;
    description: string,
    created: string;
    x_cvss?: {
        v3_1?: {
            base_score: number
        }
    }
}

function CVEListPage() {
    const [cves, setCves] = useState<CVE[]>([])
    const [page, setPage] = useState(0)
    const [totalResultsCount, setTotalResutsCount] = useState(0)
    const [filter, setFilter] = useState({
        cve_id: '',
        attack_id: '',
        cpes_vulnerable: '',
        cvss_base_score_min: '',
        weakness_id: '',
    })
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [sortField, setSortField] = useState<string>('created');
    const [loading, setLoading] = useState(false)
    const [initialDataLoaded, setInitialDataLoaded] = useState(false)
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setFilterField('cpes_vulnerable', query.get('cpe_id') || '')
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

    const loadData = async () => {
        setLoading(true)
        const res = await fetchCves(filter, page, sortField + (sortOrder === 'asc' ? '_ascending' : '_descending'))
        setCves(res.data.objects)
        setTotalResutsCount(res.data.total_results_count)
        setLoading(false)
    }

    const filterCves = async () => {
        setPage(0)
        loadData()
    }

    useEffect(() => {
        if (!initialDataLoaded) return
        loadData()
    }, [page, initialDataLoaded])

    useEffect(() => {
        document.title = `CPE List | ${APP_TITLE}`
    }, [])

    return (
        <Container>
            <Typography variant="h4" > CVE List </Typography>
            <Grid2 container spacing={2}>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <span>CVE ID</span>
                        <TextField value={filter.cve_id} onChange={(ev) => setFilterField('cve_id', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <span>CPE ID(Accepts partial)</span>
                        <TextField value={filter.cpes_vulnerable} onChange={(ev) => setFilterField('cpes_vulnerable', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <span>CWE ID</span>
                        <TextField value={filter.weakness_id} onChange={(ev) => setFilterField('weakness_id', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <span>ATT&CK ID</span>
                        <TextField value={filter.attack_id} onChange={(ev) => setFilterField('attack_id', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Base score min</span>
                        <TextField type="number" value={filter.cvss_base_score_min} onChange={(ev) => setFilterField('cvss_base_score_min', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ visibility: 'hidden' }}>Filter</span>
                        <Button onClick={() => filterCves()} variant="contained">Filter</Button>
                    </Box>
                </Grid2>
            </Grid2>

            <TableContainer>

                <Typography sx={{ marginTop: '1rem' }} variant="h5">Results</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>CVE ID</TableCell>
                            <TableCell>CVE Description</TableCell>
                            <TableCell onClick={() => handleSortChange('created')} style={{ cursor: 'pointer' }}>
                                Date Published
                                {sortField === 'created' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </TableCell>
                            <TableCell onClick={() => handleSortChange('cvss_base_score')} style={{ cursor: 'pointer' }}>
                                Base Score
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
                            {cves.map(cve => <TableRow key={cve.id}>
                                <TableCell><Link to={URLS.vulnerabilityDetailPage(cve.name)}>{cve.id}</Link></TableCell>
                                <TableCell>{cve.description}</TableCell>
                                <TableCell>{getDateString(cve.created)}</TableCell>
                                <TableCell>{cve?.x_cvss?.v3_1?.base_score}</TableCell>
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

export default CVEListPage;
