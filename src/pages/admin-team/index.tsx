import React, { useEffect } from "react";
import {
  Container,
} from "@mui/material";
import TeamList from "../teams/teams.tsx";


function AdminTeams() {
  useEffect(() => {
    document.title = 'Manage Teams | Ctibutler Web'
  }, [])

  return (
    <Container>
      <TeamList isAdmin={true}></TeamList>
    </Container>
  );
}

export default AdminTeams;
