// src/components/AcceptInvite.js
import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { setInvitationId } from '../../services/storage.ts';
import { URLS } from '../../services/urls.ts';


const AcceptInvite = () => {
    const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()
    const { invite_id } = useParams<{ invite_id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!invite_id || isLoading) return
        if (!isAuthenticated) {
            setInvitationId(invite_id)
            loginWithRedirect({})
            return
        }
        navigate(URLS.profile())
    }, [invite_id, isLoading, isAuthenticated]);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 8,
                    padding: 2,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                }}
            >
                <Typography>Loading...</Typography>
            </Box>
        </Container>
    );
};

export default AcceptInvite;
