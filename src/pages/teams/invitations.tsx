// Invitations.tsx
import React, { useEffect, useState } from "react";
import {
  TableCell,
  TableRow,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Api } from "../../services/api.ts";
import { IInvitation } from "../../services/types.ts";
import { useNavigate } from "react-router-dom";
import { URLS } from "../../services/urls.ts";


function Invitations() {
  const [invitedTeams, setInvitedTeams] = useState<IInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<number | null>(null);
  const [activeInvite, setActiveInvite] = useState<IInvitation>()
  const navigate = useNavigate()

  async function loadInvitations() {
    try {
      const results = await Api.fetchMyInvitations()
      setInvitedTeams(results);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCancelDialog = (id: number) => {
    setSelectedInvitationId(id);
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setSelectedInvitationId(null);
  };

  const handleOpenAcceptDialog = (invitation: IInvitation) => {
    setSelectedInvitationId(invitation.id);
    setActiveInvite(invitation);
    setOpenAcceptDialog(true);
  };

  const handleCloseAcceptDialog = () => {
    setOpenAcceptDialog(false);
    setSelectedInvitationId(null);
  };

  const handleCancelInvitation = async () => {
    if (selectedInvitationId !== null) {
      try {
        await Api.cancelInvite(selectedInvitationId)
        loadInvitations();
      } catch (error) {
        console.error("Failed to cancel invitation:", error);
      } finally {
        handleCloseCancelDialog();
      }
    }
  };

  const handleAcceptInvitation = async () => {
    if (selectedInvitationId !== null) {
      try {
        await Api.acceptInvite(selectedInvitationId)
        navigate(URLS.teamManagement(activeInvite?.team.id))
      } catch (error) {
        console.error("Failed to accept invitation:", error);
      } finally {
        handleCloseAcceptDialog();
      }
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  return (
    <>
      {loading ? (
        <TableRow>
          <TableCell colSpan={4} align="center">
            <CircularProgress />
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
              Loading invited users...
            </Typography>
          </TableCell>
        </TableRow>
      ) : invitedTeams.length > 0 ? (
        invitedTeams.map((invitation, index) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.team.name}</TableCell>
            <TableCell>{invitation.team.description}</TableCell>
            {/* <TableCell>{invitation.role}</TableCell> */}
            <TableCell>Invited</TableCell>
            <TableCell>True</TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button
                onClick={() => handleOpenAcceptDialog(invitation)}
                variant="contained" color="success" sx={{ ml: 1 }}>
                Accept Invite
              </Button>
              <Button
                onClick={() => handleOpenCancelDialog(invitation.id)}
                variant="contained" color="error" sx={{ ml: 1 }}>
                Reject Invite
              </Button>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
        </TableRow>
      )}

      {/* Cancel Invitation Dialog */}
      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancel Invitation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reject this invitation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseCancelDialog} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCancelInvitation} color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Accept Invitation Dialog */}
      <Dialog open={openAcceptDialog} onClose={handleCloseAcceptDialog}>
        <DialogTitle>Accept Invitation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to accept this invitation?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseAcceptDialog} color="error">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAcceptInvitation} color="success">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Invitations;
