import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const StaffLayout = () => {
  const {user, isLoading} = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if(!isLoading) {
      if(!user?.metadata_is_staff) {
        navigate('/profile')
      }
    }
  }, [isLoading])
  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default StaffLayout;
