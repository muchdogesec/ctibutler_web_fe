import React, { useContext, useEffect } from "react";
import {
  Container,
  Typography,
} from "@mui/material";
import TeamManagement from "./team-management.tsx";
import { useNavigate } from "react-router-dom";
import { TeamContext } from "../../contexts/team-context.tsx";
import { URLS } from "../../services/urls.ts";


function AddNewTeam() {
  const { reloadTeamListIndex, setReloadTeamListIndex } = useContext(TeamContext);

  const navigate = useNavigate()

  const onTeamListUpdated = (teamId) => {
    setReloadTeamListIndex(reloadTeamListIndex + 1)
    navigate(URLS.teamManagement(teamId))
  }


  useEffect(() => {
    document.title = 'Add a New Team | Ctibutler Web'
  }, [])

  return (
    <Container>
      <Typography variant="h4">Create a new team</Typography>
      <Typography>Once you've created a team you can add users to it. You can change the team name and description at any time.</Typography>
      <TeamManagement
        onClose={() => null}
        team={null}
        onTeamUpdated={onTeamListUpdated}
        isAdmin={true}
      />
    </Container>
  );
}

export default AddNewTeam;
