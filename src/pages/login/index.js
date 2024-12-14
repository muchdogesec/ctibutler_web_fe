import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { CircularProgress, Container, Typography, Box } from "@mui/material";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

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
          You are not logged in. Redirecting you to login...
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
