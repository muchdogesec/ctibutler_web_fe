import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { CircularProgress, Container, Typography, Box } from "@mui/material";

const Logout = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
            Logging out
        </Typography>
      </Box>
    </Container>
  );
};

export default Logout;
