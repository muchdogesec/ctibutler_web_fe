
import React, { useEffect, } from "react";
import { CircularProgress } from '@mui/material';

import { useNavigate } from "react-router-dom";
import { clearAuthData } from "../../services/storage.ts";

const LogoutRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    clearAuthData()
    navigate("/")
  })
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );
};

export default LogoutRedirect;