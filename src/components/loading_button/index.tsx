import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';

// Define props, extending ButtonProps to allow standard Button properties
interface LoadingButtonProps extends ButtonProps {
    isLoading: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ isLoading, children, ...props }) => {
    return (
        <Button
            {...props} // Spread standard button props
            disabled={isLoading || props.disabled} // Disable when loading or already disabled
        >
            {isLoading ? (
                <CircularProgress size={24} color="inherit" /> // Show spinner when loading
            ) : (
                children // Show button content when not loading
            )}
        </Button>
    );
};

export default LoadingButton;
