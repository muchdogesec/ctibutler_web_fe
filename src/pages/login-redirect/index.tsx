
import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Dialog, DialogTitle, DialogActions, Button, CircularProgress, DialogContent, Typography } from '@mui/material'; // Install @mui/material if you haven't already

import { useNavigate } from "react-router-dom";
import { getActiveTeamId, getInvitationId, setActiveTeamId, setApiKey, setAuthToken, setUserData } from "../../services/storage.ts";
import { Api } from "../../services/api.ts";
import { TeamContext } from "../../contexts/team-context.tsx";
import { URLS } from "../../services/urls.ts";
import EmailInputDialog from "./email-input-modal.tsx";


const ErrorDialog = ({ open, onClose, errorMessage, onResendClicked }) => {
  const sendVerificationMail = async () => {
    onResendClicked()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <Typography>{errorMessage}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => sendVerificationMail()} variant="contained" color="primary">
          Resend verification mail
        </Button>
        <Button onClick={onClose} variant="contained" color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LoginRedirect = () => {
  const { error, user, getAccessTokenSilently, isAuthenticated, isLoading, logout } = useAuth0();
  const [loading, setLoading] = useState(true)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showEmailInputDialog, setShowEmailInputDialog] = useState(false);
  const { setActiveTeam } = useContext(TeamContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (error?.message) setShowErrorDialog(true)
  }, [error])

  async function authApi(access_token: string) {
    const key = await Api.authApi(access_token)
    setApiKey(key);
  }

  async function updateAccessToken() {
    const token = await getAccessTokenSilently()
    await authApi(token)
    setUserData(user)
    setAuthToken(token)
    redirect_user()
  }

  function showEmailNotVerifiedDialog() {
    setLoading(false)
  }

  useEffect(() => {
    if (isLoading) return
    if (isAuthenticated && !user?.email_verified) {
      return showEmailNotVerifiedDialog()
    }
    updateAccessToken()
  }, [isLoading])


  const redirect_user = async () => {
    if (!user?.email_verified) {
      logout()
    }
    const invitationId = getInvitationId()
    if (invitationId) {
      navigate(URLS.profile())
    } else {
      const res = await Api.fetchTeams(0, '');
      const teams = res.data.results

      let activeTeamId = getActiveTeamId();
      const team = teams.find(team => team.id === activeTeamId)
      if (team) {
        setActiveTeam(team)
      } else {
        setActiveTeam(teams[0])
        setActiveTeamId(teams[0].id)
      }
      navigate(
        URLS.teamManagement(activeTeamId)
      )
    }
  };

  const onResendClicked = () => {
    setShowEmailInputDialog(true)
    setShowErrorDialog(false)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Dialog open={true} onClose={redirect_user}>
          <DialogTitle>{user?.email_verified ? 'Login successful' : 'Email not verified'}</DialogTitle>
          <DialogActions>
            <Button onClick={redirect_user} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <ErrorDialog
        open={showErrorDialog}
        onResendClicked={() => onResendClicked()}
        onClose={() => navigate('/')} errorMessage={error?.message}
      />
      <EmailInputDialog
        open={showEmailInputDialog}
        onClose={() => setShowEmailInputDialog(false)}
      />
    </div>
  );
};

export default LoginRedirect;