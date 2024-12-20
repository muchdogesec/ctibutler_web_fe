// TeamManagement.tsx
import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { Api } from "../../services/api.ts";
import { ITeam } from "../../services/types.ts";
import LoadingButton from "../../components/loading_button/index.tsx";
import { TeamContext } from "../../contexts/team-context.tsx";


interface TeamManagementProps {
  onClose: () => void;
  team: ITeam | null;
  onTeamUpdated: (id: string) => void;
  isAdmin: boolean;
  disabled: boolean;
  isDialog?: boolean;
}

function TeamManagement({ onClose, team, onTeamUpdated, isAdmin, disabled, isDialog = false }: TeamManagementProps) {
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [loading, setLoading] = useState(false)
  const { setActiveTeam } = useContext(TeamContext);

  useEffect(() => {
    setTeamNameError("")
    if (team) {
      setTeamName(team.name);
      setTeamDescription(team.description);
    } else {
      setTeamName("");
      setTeamDescription("");
    }
  }, [team]);

  const handleSave = async () => {
    setLoading(true)
    try {
      if (isAdmin && team?.id) {
        await Api.adminUpdateTeam(team.id, { name: teamName, description: teamDescription });
      }
      else if (team?.id) {
        await Api.updateTeam(team.id, { name: teamName, description: teamDescription });
        onClose();
        onTeamUpdated(team.id);
      } else {
        const res = await Api.createTeam(teamName, teamDescription);
        setActiveTeam(res.data)
        onClose();
        onTeamUpdated(res.data.id);
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        setTeamNameError(error?.response?.data?.name)
      } else {

      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <Box>
      {team?.id && (
        <TextField
          autoFocus
          rows={3}
          margin="dense"
          label="Team ID"
          fullWidth
          disabled={true}
          value={team?.id}
        />
      )}

      <TextField
        autoFocus
        margin="dense"
        variant="outlined"
        label="Team Name"
        fullWidth
        value={teamName}
        disabled={disabled}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <Typography sx={{ color: 'red' }}>{teamNameError}</Typography>
      <TextField
        autoFocus
        rows={3}
        margin="dense"
        variant="outlined"
        label="Team Description"
        fullWidth
        disabled={disabled}
        value={teamDescription}
        onChange={(e) => setTeamDescription(e.target.value)}
      />
      {isDialog ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <Button onClick={onClose} variant='contained' color='error' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton sx={{ marginLeft: '1rem' }} variant="contained" disabled={(teamName?.length || 0) <= 5} onClick={handleSave} color="primary" isLoading={loading}>
            {team?.id ? "Save changes" : "Create team"}
          </LoadingButton>
        </Box>
      ) : (<>
        {!disabled && (
          <>
            <LoadingButton variant="contained" onClick={handleSave} disabled={(teamName?.length || 0) <= 5} color="primary" isLoading={loading}>
              {team?.id ? "Save changes" : "Create team"}
            </LoadingButton>
            {team?.id && (<Button onClick={onClose} variant="contained" color="error" sx={{ marginLeft: '2rem' }} > Cancel </Button>)}
          </>
        )
        }</>
      )}

    </Box >
  );
}

export default TeamManagement;
