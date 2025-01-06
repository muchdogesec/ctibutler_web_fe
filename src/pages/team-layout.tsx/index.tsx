import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Api } from '../../services/api.ts';
import { ITeamWithLimit } from '../../services/types.ts';
import { URLS } from '../../services/urls.ts';
import { TeamContext } from '../../contexts/team-context.tsx';

export const TeamRouteContext = createContext<{
  teamId?: string, setTeamId: (teamId: string) => void,
}>({
  teamId: undefined,
  setTeamId: (teamId: string) => null,
});

const TeamLayout = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<ITeamWithLimit>();
  const [id, setId] = useState<string>();
  const { activeTeam, setActiveTeam } = useContext(TeamContext)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const teamIdQuery = params.get('team_id');
    if (teamIdQuery) {
      setId(teamIdQuery)
    }
    else if (teamId) {
      setId(teamId)
    }
    else {
      setId(activeTeam?.id || '')
    }
  }, [location.search, teamId, activeTeam]);

  const loadLimits = async () => {
    if (!id || id === "undefined") return
    try {
      const res = await Api.fetchTeamLimits(id)
      setTeam(res.data)
      setActiveTeam(res.data)
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 404) {
        navigate(URLS.profile())
        return
      }
      throw err

    }

  }

  useEffect(() => {
    if (id) {
      loadLimits()
    }
  }, [id])
  return (
    <Box>
      <TeamRouteContext.Provider value={{ teamId: id, setTeamId: setId }}>
        {team?.limits_exceeded && <Box sx={{ color: 'white', padding: '1rem', bgcolor: 'red', width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: '2rem' }}>
          {!team.has_active_subscription ? 'No active subscription. Please activate your subscription in team management.' : 'You have exceeded your limits for this team'}
        </Box>}
        <Outlet />
      </TeamRouteContext.Provider>
    </Box>
  );
};

export default TeamLayout;
