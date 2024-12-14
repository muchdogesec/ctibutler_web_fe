import React, { createContext, useContext, useState } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

// Create a context for the alert
const AlertContext = createContext<{ showAlert: (taxt: string, severity?: AlertColor) => void }>({
    showAlert: (text, severity) => null,
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState<{
        open: boolean,
        message: string,
        severity: AlertColor
    }>({ open: false, message: '', severity: 'info' });

    const showAlert = (message, severity: AlertColor = 'info') => {
        setAlert({ open: true, message, severity });
    };

    const closeAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={closeAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={closeAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};
