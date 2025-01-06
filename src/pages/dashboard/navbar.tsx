import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Select, MenuItem } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { Api } from '../../services/api.ts';
import { getActiveTeamId, setActiveTeamId } from '../../services/storage.ts';
import UserPopover from './user-popover.tsx';
import './styles.css'
import StaffPopover from './staff-popover.tsx';
import { TeamContext } from '../../contexts/team-context.tsx';
import { ITeam } from '../../services/types.ts';
import { URLS } from '../../services/urls.ts';
import AddTeamDialog from './new-team.tsx';

const drawerWidth = 240;

const NavBar = () => {
    const { user } = useAuth0();
    const { activeTeam, setActiveTeam, reloadTeamListIndex } = useContext(TeamContext);
    const [selectedTeamId, setSelectedTeamId] = useState('')

    const [teams, setTeams] = useState<ITeam[]>([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [showAddTeam, setShowAddTeam] = useState(false)

    async function reloadTeams() {
        const res = await Api.fetchTeams(0, '');
        const teams = res.data.results
        setTeams(teams);
    }

    useEffect(() => {
        if (teams.length === 0) return
        const selectedTeam = teams.find(team => team.id === activeTeam?.id)
        if (selectedTeam) {
            setSelectedTeamId(selectedTeam.id)
        } else {
            setSelectedTeamId("account")
        }
    }, [activeTeam, teams])

    async function loadTeams() {
        try {
            const res = await Api.fetchTeams(0, '');
            const teams = res.data.results
            setTeams(teams);

            let activeTeamId = getActiveTeamId();
            const team = teams.find(team => team.id === activeTeamId)
            if (team) {
                setActiveTeam(team)
            } else {
                setActiveTeam(teams[0])
                setActiveTeamId(teams[0].id)
            }
        } catch (error) {
            console.error("Failed to fetch teams:", error);
        } finally {
            setLoading(false);
        }
    }

    const changeTeam = (team: ITeam) => {
        setActiveTeam(team)
        setActiveTeamId(team.id)
        navigate(URLS.teamManagement(team.id))
    }

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        if (reloadTeamListIndex > 0) {
            reloadTeams()
        }
    }, [reloadTeamListIndex])

    return (
        <AppBar position="fixed" sx={{ ml: `${drawerWidth}px`, background: '#0073ec' }}>

            <Toolbar sx={{ background: '#0073ec' }}>
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                    CTI Butler
                </Typography>
                {user?.metadata_is_staff && <StaffPopover></StaffPopover>}
                {user ? (
                    <>
                        <Select
                            style={{ color: 'white', height: '60px', border: 'none' }}
                            value={selectedTeamId}
                        >
                            <MenuItem onClick={() => navigate(URLS.profile())} key="account" value={"account"}>Account Settings</MenuItem>
                            {teams.map((team) => (
                                <MenuItem onClick={() => changeTeam(team)} key={team.id} value={team.id}>{team.name}</MenuItem>
                            ))}
                            <MenuItem onClick={() => setShowAddTeam(true)}>+ Create a new Team</MenuItem>
                        </Select>

                        <UserPopover userEmail={user?.name || ''}></UserPopover>
                    </>
                ) : (<></>)}
            </Toolbar>
            <AddTeamDialog onClose={() => setShowAddTeam(false)} open={showAddTeam}></AddTeamDialog>
        </AppBar >
    );
};

export default NavBar;
