// Teams.tsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TablePagination,
  TextField
} from "@mui/material";
import { Link } from "react-router-dom";
import { Api } from "../../services/api.ts";
import { AdminTeam, ITeam } from "../../services/types.ts";
import Invitations from "./invitations.tsx";
import { URLS } from "../../services/urls.ts";
import { useAlert } from "../../contexts/alert-context.tsx";
import AddTeamDialog from "../dashboard/new-team.tsx";

const ConfirmLeaveTeamDialog = ({ open, onClose, team }: {
  open: boolean, onClose: (reload: boolean) => void, team?: ITeam
}) => {
  const alert = useAlert()

  const leaveTeam = async (teamId?: string) => {
    if (!teamId) return
    try {
      await Api.leaveTeam(teamId)
      onClose(true)
    } catch (err) {
      if (err?.response?.status === 400) {
        onClose(false)
        return alert.showAlert(err?.response?.data[0])
      }
      throw err
    }
    onClose(false)

  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave Team</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to leave {team?.name}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button variant='contained' onClick={() => leaveTeam(team?.id)} color="error">
          Leave team
        </Button>
      </DialogActions>
    </Dialog>
  );
};



function TeamList() {
  const [teams, setTeams] = useState<(ITeam & AdminTeam)[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const [showLeaveTeamDialog, setShowLeaveTeamDialog] = useState(false)
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [showAddTeam, setShowAddTeam] = useState(false)

  async function loadTeams() {
    try {
      const res = await Api.fetchTeams(page, search);
      setTotalResultsCount(res.data.count)
      setTeams(res.data.results);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, [page, search]);

  const getRole = (team: ITeam) => {
    if (team.is_owner) return 'Owner'
    if (team.is_admin) return 'Admin'
    return 'Member'
  }

  const handleOpenLeaveTeamModal = (team: ITeam) => {
    setSelectedTeam(team)
    setShowLeaveTeamDialog(true)
  }

  const closeLeaveTeamDialog = (reload: boolean) => {
    setShowLeaveTeamDialog(false)
    if (reload) loadTeams()
  }

  const filter = () => {
    setPage(0)
    loadTeams()
  }

  const limitExceeded = (team: AdminTeam) => {
    if ((team.members_count + team.invitations_count) > team.user_limit) {
      return true
    }
    return false
  }

  const showTeamLink = (team: ITeam) => {
    return true
  }
  return (
    <>
      <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Your Teams
          </Typography>
          <Typography className="description">
            <p>You can create one or more teams below.</p>
            <p>Most users only require one team that represents their organisation.</p>
            <p>Each team you create has a subscription which controls the features the users in the teams can access.</p>
          </Typography>
          <Button onClick={() => setShowAddTeam(true)} variant="contained" color="primary">
            Add New Team
          </Button>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Subscription Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                      Loading teams...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                teams.map((team, index) => (
                  <TableRow key={team.id} sx={{ backgroundColor: limitExceeded(team) ? 'pink' : 'transparent' }}>
                    <TableCell>
                      {showTeamLink(team) ? (<Link to={URLS.teamManagement(team.id)}>{team.name}</Link>) : <>{team.name}</>}
                    </TableCell>
                    <TableCell>{team.description}</TableCell>
                    <TableCell>{getRole(team)}</TableCell>
                    <TableCell>{team.subscription?.items[0].price.product_name || 'No Active Plan'}</TableCell>
                    <TableCell>{team.subscription?.status}</TableCell>
                    <TableCell>
                      <Link to={URLS.teamManagement(team.id)}>
                        <Button
                          variant="contained"
                          sx={{ ml: 1 }}
                        >
                          Manage
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
              <Invitations></Invitations>

            </TableBody>
          </Table>
        </TableContainer>
        {selectedTeam && <ConfirmLeaveTeamDialog open={showLeaveTeamDialog} onClose={closeLeaveTeamDialog} team={selectedTeam}></ConfirmLeaveTeamDialog>}
        <AddTeamDialog onClose={() => setShowAddTeam(false)} open={showAddTeam}></AddTeamDialog>
      </Box>
    </ >
  );
}

export default TeamList;
