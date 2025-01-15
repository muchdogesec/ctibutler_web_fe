import React, { useEffect } from "react";
import {
  Container,
} from "@mui/material";
import TeamList from "../teams/teams.tsx";
import { APP_TITLE } from "../../config.ts";


function AdminTeams() {
  useEffect(() => {
    document.title = `Manage Teams | ${APP_TITLE}`
  }, [])

  return (
    <Container>
      <TeamList isAdmin={true}></TeamList>
    </Container>
  );
}

export default AdminTeams;
