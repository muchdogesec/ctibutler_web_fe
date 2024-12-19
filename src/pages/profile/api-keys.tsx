import React, { useState, useEffect } from 'react';
import {
    Container,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { Api } from '../../services/api.ts';
import { ITeam } from '../../services/types.ts';
import ApiKeyDialog from './token-dialog.tsx';

interface ApiKey {
    id: string;
    team_name: string;
    clear_key: string;
    name: string;
    key_id: string;
    last_used: string;
    status: string;
}

const ApiKeyManager = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [teamId, setTeamId] = useState<string>();
    const [newKey, setNewKey] = useState('');
    const [newKeyName, setNewKeyName] = useState('');
    const [showKeyDialog, setShowKeyDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [selectedKey, setSelectedKey] = useState<ApiKey>()
    const [deleteError, setDeleteError] = useState('')

    async function loadTeams() {
        const res = await Api.fetchTeams(0, '');
        setTeams(res.data.results);
    }

    useEffect(() => {
        loadTeams();
        loadApiKeys();
    }, []);

    const loadApiKeys = async () => {
        const res = await Api.fetchApiKeys();
        setApiKeys(res.data.results);
    }

    const handleChange = (e) => {
        const { value } = e.target;
        setTeamId(value);
    };

    const handleSubmit = async () => {
        if (!teamId || !newKeyName) return;
        const response = await Api.createApiKey(teamId, { name: newKeyName });
        setNewKey(response.data.key);
        setShowKeyDialog(true);
        setShowCreateDialog(false)
        loadApiKeys();
    };

    const initDelete = async (key: ApiKey) => {
        setNewKeyName('')
        setDeleteError('')
        setShowDeleteDialog(true)
        setSelectedKey(key)
    };

    const handleDelete = async () => {
        if (selectedKey?.name !== newKeyName) {
            setDeleteError('Wrong description')
            return
        }
        await Api.deleteApiKeys(selectedKey?.key_id || '');
        loadApiKeys();
        setShowDeleteDialog(false)
    }

    const initCreateToken = () => {
        setNewKeyName('')
        setTeamId(undefined)
        setShowCreateDialog(true)
    }

    return (
        <>
            <Typography variant='h5'>API Keys</Typography>
            <Typography className="description">
                You can generate API keys to use with the Ctibuttler API. API keys are linked to teams, and will only return the data for the specific team it is assigned to. Note, if your teams subscription does not support API use then you will not be able to generate an API key for it. Please ask the team owner or admins to upgrade the teams subscription.
            </Typography>
            <Button variant="contained" sx={{textTransform: 'uppercase'}} onClick={() => {initCreateToken()}}>Create Token</Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Team Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Last Used</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiKeys.map((apiKey) => (
                            <TableRow key={apiKey.id}>
                                <TableCell>{apiKey.team_name}</TableCell>
                                <TableCell>{apiKey.name}</TableCell>
                                <TableCell>{apiKey.last_used}</TableCell>
                                <TableCell>{apiKey.status === 'active' ? 'Active' : 'Deativated (contact team admin)'}</TableCell>
                                <TableCell>
                                    <Button variant='contained' color='error' onClick={() => initDelete(apiKey)}>Revoke</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
                <DialogTitle>Create an API Token</DialogTitle>
                <DialogContent>
                    <Typography>API keys are linked to teams, and will only return the data for the team it is assigned to. Note, if your teams subscription does not support API use then you will not be able to generate an API key for it. Please ask the team owner or admins to upgrade the teams subscription.</Typography>
                    <TextField
                        label="API Key description (max 50 characters)"
                        variant="outlined"
                        fullWidth
                        value={newKeyName}
                        onChange={(ev) => setNewKeyName(ev.target.value)}
                    />

                    <Select
                        label="Team to use with API Key"
                        style={{ width: '100%', marginTop: '16px' }}
                        onChange={handleChange}
                        value={teamId}
                    >
                        {teams.filter(team => team.allowed_api_access).map((team) => (
                            <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button sx={{textTransform: 'uppercase'}} variant='contained' color='error' onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                    
                    <Button disabled={!teamId || !newKeyName}   variant='contained' onClick={() => handleSubmit()}>Create</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogTitle>Delete API Key</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete the API key `{selectedKey?.name}`. Once deleted, all attempts to authenticate with this API Key will fail. The API Key cannot be regenerated. Please enter `{selectedKey?.name}` below to confirm you want to delete this API Key.</Typography>
                    <TextField
                        label="API Key description"
                        variant="outlined"
                        fullWidth
                        value={newKeyName}
                        onChange={(ev) => setNewKeyName(ev.target.value)}
                    />
                    <Typography color='error'>{deleteError}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button sx={{textTransform: 'uppercase'}} variant='contained' color='error' onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                    <Button sx={{textTransform: 'uppercase'}} variant='contained' color='primary' onClick={() => handleDelete()}>Delete</Button>
                </DialogActions>
            </Dialog>
            <ApiKeyDialog open={showKeyDialog} onClose={() => setShowKeyDialog(false)} apiKey={newKey}></ApiKeyDialog>

        </>
    );
};

export default ApiKeyManager;