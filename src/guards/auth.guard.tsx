import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth0()
    if (!isLoading && !isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default AuthGuard;
