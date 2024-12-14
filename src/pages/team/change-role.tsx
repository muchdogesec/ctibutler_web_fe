import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, } from "@mui/material";
import { Member } from "../../services/types.ts";
import { Api } from "../../services/api.ts";
import { useAlert } from "../../contexts/alert-context.tsx";

export const ChangeRoleDialog = ({ teamId, member, open, onClose, isOwner, onRoleChanged }: {
    member: Member, onClose: () => void, open: boolean, isOwner: boolean, teamId: string, onRoleChanged: () => void
}) => {
    const alert = useAlert()
    const [role, setRole] = useState(member.role)

    const changeRole = async () => {
        try {
            await Api.changeTeamMemberRole(teamId, member.user_id, role)
            onRoleChanged()
            onClose()
        } catch (err) {
            if (err?.response?.status === 400) {
                onClose()
                return alert.showAlert(err?.response?.data[0])
            }
            throw err
        }
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Change Role</DialogTitle>
            <DialogContent>
                <Select
                    style={{ flex: 'auto', marginLeft: '1rem', marginRight: '1rem' }}
                    value={role}
                    label="Role"
                    sx={{ minWidth: '300px' }}
                    onChange={(e) => setRole(e.target.value)}
                >
                    {member.role !== 'member' && <MenuItem key='member' value='member'>Member</MenuItem>}
                    {member.role !== 'admin' && <MenuItem key='admin' value='admin'>Admin</MenuItem>}
                    {member.role !== 'owner' && isOwner && <MenuItem key='owner' value='owner'>Owner</MenuItem>}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={() => onClose(false)} color="primary">
                    Cancel
                </Button>
                <Button variant='contained' onClick={() => changeRole()} color="error">
                    Change Role
                </Button>
            </DialogActions>
        </Dialog>
    );
};
