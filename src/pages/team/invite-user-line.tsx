import React from "react";
import {
    Box,
    Button,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";

interface InviteUserLineProps {
    email: string;
    role: string;
    onEmailChanged: (email: string) => void
    onRoleChanged: (role: string) => void
    onRemove: () => void;
    isOwner: boolean;
}

function InviteUserLine({ role, email, onRoleChanged, onEmailChanged, onRemove, isOwner }: InviteUserLineProps) {

    return (
        <Box sx={{ display: 'flex' }}>
            <TextField
                autoFocus
                margin="dense"
                label="Invite Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => onEmailChanged(e.target.value)}
            />
            <Select
                style={{ flex: 'auto', marginLeft: '1rem', marginRight: '1rem' }}
                value={role}
                label="Role"
                sx={{ minWidth: '300px' }}
                onChange={(e) => onRoleChanged(e.target.value)}
            >
                <MenuItem key='member' value='member'>Member</MenuItem>
                <MenuItem key='admin' value='admin'>Admin</MenuItem>
                {isOwner && <MenuItem key='owner' value='owner'>Owner</MenuItem>}
            </Select>
            <Button onClick={onRemove}>Remove</Button>
        </Box>
    );
}

export default InviteUserLine;
