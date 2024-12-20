import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import TeamManagement from '../teams/team-management.tsx';
import LoadingButton from '../../components/loading_button/index.tsx';
import { TeamContext } from '../../contexts/team-context.tsx';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../services/urls.ts';

const AddTeamDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    const { reloadTeamListIndex, setReloadTeamListIndex } = useContext(TeamContext);

    const navigate = useNavigate()

    const onTeamListUpdated = (teamId) => {
        setReloadTeamListIndex(reloadTeamListIndex + 1)
        navigate(URLS.teamManagement(teamId))
    }

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle><Typography variant="h4">Create a new team</Typography></DialogTitle>

        <DialogContent>
            <Typography>Once you've created a team you can add users to it. You can change the team name and description at any time.</Typography>

            <TeamManagement
                onClose={onClose}
                team={null}
                disabled={false}
                onTeamUpdated={onTeamListUpdated}
                isAdmin={true}
                isDialog={true}
                ></TeamManagement>
        </DialogContent>
        <DialogActions>
        </DialogActions>
    </Dialog>
}

export default AddTeamDialog