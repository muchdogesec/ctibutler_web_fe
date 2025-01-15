import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table, TableHead, TableRow, TableBody, TableCell,
    TableContainer,
    Grid2,
    Box,
    TextField,
    Button,
    TablePagination,
    CircularProgress
} from "@mui/material";
import { APP_TITLE } from "../../../config.ts";
import { fetchCpes, fetchCves } from "../../../services/vulmatch_api.ts";
import { Link } from "react-router-dom";
import { URLS } from "../../../services/urls.ts";

type CPE = {
    id: string;
    cpe: string;
    vendor: string;
    version: string;
    x_cpe_struct: {
        product: string;
        update: string;
    }
}

function CPEListPage() {
    const [cpes, setCpes] = useState<CPE[]>([])
    const [page, setPage] = useState(0)
    const [totalResultsCount, setTotalResutsCount] = useState(0)
    const [filter, setFilter] = useState({
        vendor: '',
        product: '',
        cpe_id: '',
        cvss_base_score_min: '',
        weakness_id: '',
    })
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [sortField, setSortField] = useState<string>('created');
    const [loading, setLoading] = useState(false)


    const setFilterField = (fieldName: string, value: string) => {
        setFilter((filer) => ({ ...filter, [fieldName]: value }))
    }

    const loadData = async () => {
        setLoading(true)
        const res = await fetchCpes(filter, page)
        setCpes(res.data.objects)
        setTotalResutsCount(res.data.total_results_count)
        setLoading(false)
    }

    const filterCpes = async () => {
        setPage(0)
        loadData()
    }

    useEffect(() => { loadData() }, [page])

    useEffect(() => {
        loadData()
        document.title = `CPE List | ${APP_TITLE}`
    }, [])

    return (
        <Container>
            <Typography variant="h4" > CPE List </Typography>
            <Grid2 container spacing={2}>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <span>Vendor</span>
                        <TextField value={filter.vendor} onChange={(ev) => setFilterField('vendor', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <span>Product</span>
                        <TextField value={filter.product} onChange={(ev) => setFilterField('product', ev.target.value)}></TextField>
                    </Box>
                </Grid2>
                {/* <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                        <span>Version</span>
                        <TextField></TextField>
                    </Box>
                </Grid2>
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Update</span>
                        <TextField value={filter.attack_id} onChange={(ev) => setFilterField('attack_id', ev.target.value)}></TextField>
                    </Box>
                </Grid2> */}
                <Grid2 size={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ visibility: 'hidden' }}>Filter</span>
                        <Button onClick={() => filterCpes()} variant="contained">Filter</Button>
                    </Box>
                </Grid2>
            </Grid2>


            <TableContainer sx={{ marginTop: '1rem' }}>


                <Typography variant="h5" > Results </Typography>


                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Update</TableCell>
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
                            {cpes.map(cpe => <TableRow>
                                <TableCell>{cpe.vendor}</TableCell>
                                <TableCell>{cpe.x_cpe_struct?.product}</TableCell>
                                <TableCell>{cpe.version}</TableCell>
                                <TableCell>{cpe.x_cpe_struct?.update}</TableCell>
                                <TableCell><Link to={URLS.vulnerabilityListPageForCpe(cpe.cpe)}><Button>View CVEs</Button></Link></TableCell>
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
        </Container>
    );
}

export default CPEListPage;
