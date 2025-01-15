import React, { useEffect, useState } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Typography,
    TablePagination,
    TextField,
    TableSortLabel,
    Chip,
} from '@mui/material';
import { Api, IUser } from '../../services/api.ts';
import { Link, useLocation } from 'react-router-dom';
import { URLS } from '../../services/urls.ts';
import { APP_TITLE } from '../../config.ts';

const UserManagement = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [page, setPage] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof IUser>('email');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchValue = searchParams.get('email');
    const [search, setSearch] = useState(searchValue || '');
  

    const loadUsers = async () => {
        const res = await Api.adminFetchUsers({
            page: page + 1,
            search,
            sort_by: orderBy,
            order,
        });
        setUsers(res.data.results);
        setTotalResults(res.data.count);
    };

    useEffect(() => {
        loadUsers();
    }, [page, search, order, orderBy]);

    const makeStaff = async (user: IUser) => {
        await Api.makeAdmin(user.id);
        loadUsers();
    };

    const removeStaff = async (user: IUser) => {
        await Api.removeAdmin(user.id);
        loadUsers();
    };

    const toggleStaff = async (user: IUser) => {
        if (user.is_staff) removeStaff(user);
        else makeStaff(user);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0); // Reset to first page on search
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleSortRequest = (property: keyof IUser) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        document.title = `Manage User | ${APP_TITLE}`
    }, [])

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <TextField
                label="Filter by Name"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'email'}
                                    direction={orderBy === 'email' ? order : 'asc'}
                                    onClick={() => handleSortRequest('email')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'date_joined'}
                                    direction={orderBy === 'date_joined' ? order : 'asc'}
                                    onClick={() => handleSortRequest('date_joined')}
                                >
                                    Date joined
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'last_login'}
                                    direction={orderBy === 'last_login' ? order : 'asc'}
                                    onClick={() => handleSortRequest('last_login')}
                                >
                                    Last Login
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'is_staff'}
                                    direction={orderBy === 'is_staff' ? order : 'asc'}
                                    onClick={() => handleSortRequest('is_staff')}
                                >
                                    Staff Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Teams(Owner)</TableCell>
                            <TableCell>Teams(Member)</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(user.date_joined).toLocaleString()}</TableCell>
                                <TableCell>{new Date(user.last_login).toLocaleString()}</TableCell>
                                <TableCell>{user.is_staff ? 'Staff' : 'User'}</TableCell>
                                <TableCell>{user.teams.filter(team => team.owner_id === user.id).map(team => <Link to={URLS.teamManagement(team.id)}><Chip label={team.name} /></Link>)}</TableCell>
                                <TableCell>{user.teams.filter(team => team.owner_id !== user.id).map(team => <Link to={URLS.teamManagement(team.id)}><Chip label={team.name} /></Link>)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color={user.is_staff ? 'secondary' : 'primary'}
                                        onClick={() => toggleStaff(user)}
                                    >
                                        {user.is_staff ? 'Remove Staff' : 'Make Staff'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={totalResults}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={10}
                rowsPerPageOptions={[10]}
            />
        </Container>
    );
};

export default UserManagement;
