import React, { useEffect } from 'react';
import { getActiveTeamId, setActiveTeamId } from "../../services/storage.ts";
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../services/urls.ts';


function LandingPage() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const navigate = useNavigate()

  const redirect_user = async () => {
    if (isLoading) return
    if (!isAuthenticated) {
      return loginWithRedirect({})
    }
    let activeTeamId = getActiveTeamId();
    if (!activeTeamId) {
      return loginWithRedirect({})
    }
    setActiveTeamId(activeTeamId)
    navigate(
      URLS.teamManagement(activeTeamId)
    )
  };
  useEffect(() => { redirect_user() }, [
    user, isAuthenticated, isLoading
  ])

  return (
    <div></div>
  );
}

export default LandingPage;