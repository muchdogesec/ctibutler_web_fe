import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import { ITeam } from "../../services/types.ts";
import { Api } from "../../services/api.ts";
import { URLS } from "../../services/urls.ts";
import { useNavigate } from "react-router-dom";
import { TeamContext } from "../../contexts/team-context.tsx";
import LoadingButton from "../../components/loading_button/index.tsx";

export const ConfirmDeleteDialog = ({ team, open, onClose }: {
    team: ITeam, onClose: () => void, open: boolean,
}) => {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const { reloadTeamListIndex, setReloadTeamListIndex } = useContext(TeamContext);
    const navigate = useNavigate()

    const deleteTeam = async () => {
        setLoading(true)
        try {
            await Api.deleteTeam(team.id)
            navigate(URLS.profile())
            setReloadTeamListIndex(reloadTeamListIndex + 1)
        } catch (err) {

        }
        setLoading(false)
    }

    useEffect(() => {
        setName('')
    }, [open])

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle><Typography variant="h5" sx={{ textAlign: 'center' }}>Confirm Delete Team</Typography></DialogTitle>
            <DialogContent>
                <Typography>
                    Deleting this team is irreversible. This action will immediately make the team and deactivate any API keys associated with this team. It will also cancel the teams subscription so no more payments are made (but you will not receive a refund for the remaining time until renewal) Enter the team `{team.name}` to confirm
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <TextField
                        label='Team Name'
                        style={{ flex: 'auto', marginTop: '2rem' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => onClose()} color="primary">
                    Close
                </Button>
                <LoadingButton isLoading={loading} disabled={name !== team.name} variant="contained" onClick={() => deleteTeam()} color="error">
                    Delete
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};
