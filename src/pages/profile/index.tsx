import React, { useContext, useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Snackbar,
    Alert,
    Modal,
    IconButton,
    Grid2,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { QRCodeCanvas } from 'qrcode.react';
import CloseIcon from '@mui/icons-material/Close';
import { Api } from "../../services/api.ts";
import TeamList from "../teams/teams.tsx";
import Invitations from "../teams/invitations.tsx";
import ApiKeyManager from "./api-keys.tsx";
import "./styles.css"
import { ConfirmDisable2FA } from "./confirm-disable-2fa.tsx";
import { TeamContext } from "../../contexts/team-context.tsx";

const UserProfile = () => {
    const { user } = useAuth0();
    const [email, setEmail] = useState("");
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [showDiable2FAModal, setShowDiable2FAModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setActiveTeam } = useContext(TeamContext);

    // Modal state
    const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpKey, setOtpKey] = useState("");
    const [totpSecret, setTotpSecret] = useState("");

    useEffect(() => {
        setEmail(user?.email || "");
        setIs2FAEnabled(user?.custom_mfa_enabled)
    }, [user]);

    useEffect(() => {
        setActiveTeam(null)
    })

    const handleUpdateEmail = async () => {
        try {
            setLoading(true)
            await Api.changeUserEmail(email);
            setLoading(false)
            setSnackbarMessage("Email updated successfully, check your email to verify it");
            setSnackbarSeverity("success");
            setChangeEmailModalOpen(false)
        } catch (error) {
            setLoading(false)

            setSnackbarMessage("Failed to update email");
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true);
        }
    };

    const resendVerificationEmail = async () => {
        setLoading(true)
        try {
            await Api.resendVerificationEmail()
            setSnackbarMessage("Verification email sent successfully, check your email to verify it");
            setSnackbarSeverity("success");
        } catch (error) {
            setLoading(false)

            setSnackbarMessage("Unable to send verification email");
            setSnackbarSeverity("error");
        }
        finally {
            setLoading(false)
            setSnackbarOpen(true);
        }
    }

    const handleChangePassword = async () => {
        try {
            setLoading(true)

            await Api.changeUserPassword();
            setLoading(false)

            setSnackbarMessage("Check your mail to complete the process");
            setSnackbarSeverity("success");
        } catch (error) {
            setLoading(false)

            setSnackbarMessage("Failed to change password");
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true);
        }
    };

    const initToggle2FA = async () => {
        try {
            setLoading(true)

            const res = await Api.initializeOTP();
            setLoading(false)

            if (res.data.data.totp_uri) {
                setTotpSecret(res.data.data.totp_uri);
                setOtpKey(res.data.data.totp_secret)
                setModalOpen(true); // Open the modal to scan OTP
            }
        } catch (error) {
            setLoading(false)

            setSnackbarMessage("Failed to toggle 2FA");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleOtpSubmit = async () => {
        try {
            setLoading(true)

            await Api.verifyOTP(otp, otpKey);
            setLoading(false)

            setSnackbarMessage("2FA setup successful");
            setSnackbarSeverity("success");
            setModalOpen(false); // Close the modal after successful setup
            setIs2FAEnabled(true)
        } catch (error) {
            setLoading(false)

            setSnackbarMessage("Failed to verify OTP");
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true);
        }
    };

    const initDisable2FA = () => {
        setShowDiable2FAModal(true)
    }

    useEffect(() => {
        document.title = 'Account Settings | CTI Butler Web'
    }, [])

    const handleCloseDisable2FAModal = (disabled: boolean) => {
        if (disabled) {
            setIs2FAEnabled(false)
        }
        setShowDiable2FAModal(false)
    }
    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Account Settings
                </Typography>
                <Typography className="description">Use this page to make changes to your account.</Typography>
                <Typography variant="h5">Authentication details</Typography>
                <Typography className="description">
                    <p>It is not currently possible to edit your email address. If you wish to use another email, you can delete this account and create another account using the desired email.
                    </p>
                </Typography>
                <Grid2 container spacing={2}>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <TextField
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            disabled={true}
                            style={{ flex: 'auto', width: '50ch' }}
                        />
                    </Box>
                </Grid2>
                <Grid2 container spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleChangePassword} disabled={loading}>
                        Change Password
                    </Button>
                </Grid2>
                <Grid2 container spacing={2} sx={{ marginTop: '1rem' }}>
                    {
                        is2FAEnabled ? (<Button variant="contained" color="error" onClick={initDisable2FA}>Turn off 2fa</Button>) : (
                            <Button variant="contained" onClick={initToggle2FA} disabled={loading}>Turn on 2fa</Button>
                        )
                    }

                </Grid2>

                <TeamList></TeamList>
                <Box sx={{ height: '2rem' }}></Box>
                <ApiKeyManager></ApiKeyManager>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <Dialog
                    open={changeEmailModalOpen}
                    onClose={() => setChangeEmailModalOpen(false)}
                >
                    <DialogTitle>Change password</DialogTitle>
                    <DialogContent>
                        <Box>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="User Email"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Box>
                        <DialogActions>
                            <Button onClick={() => setChangeEmailModalOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateEmail} color="primary">
                                Change
                            </Button>
                        </DialogActions>
                    </DialogContent>

                </Dialog>
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={() => setModalOpen(false)}
                            aria-label="close"
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" gutterBottom>
                            Set Up Two-Factor Authentication
                        </Typography>
                        <Box mb={2}>
                            <QRCodeCanvas value={totpSecret} />
                        </Box>
                        <TextField
                            fullWidth
                            label="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleOtpSubmit} disabled={loading}>
                            Verify OTP
                        </Button>
                    </Box>
                </Modal>
            </Box>
            <ConfirmDisable2FA
                open={showDiable2FAModal}
                onClose={handleCloseDisable2FAModal}
                email={user?.email}
            ></ConfirmDisable2FA>
        </Container >
    );
};

export default UserProfile;
