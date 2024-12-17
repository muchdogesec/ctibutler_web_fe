import React, { useContext, useEffect, useState } from "react";
import { TextField, Dialog, DialogTitle, DialogActions, Button, CircularProgress, DialogContent, Typography } from '@mui/material'; // Install @mui/material if you haven't already
import LoadingButton from '../../components/loading_button/index.tsx';
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/alert-context.tsx";
import { Api } from "../../services/api.ts";



const EmailInputDialog = ({ open, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const alert = useAlert()


    const handleSubmit = async () => {
        setLoading(true)
        try {
            await Api.resendEmailVerificationEmail(email)
        } catch (err) {
            if (err?.response?.status === 400) {
                setLoading(false)
                return alert.showAlert(err?.response?.data[0])
            }
            throw err
        }
        setLoading(false)
        navigate('/')
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Enter Your Email</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => navigate('/')} color="error">Cancel</Button>
                <LoadingButton isLoading={loading} variant="contained" onClick={handleSubmit} color="primary">Submit</LoadingButton>
            </DialogActions>
        </Dialog>
    );
};
export default EmailInputDialog;