import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
} from "@mui/material";
import InviteUserLine from "./invite-user-line.tsx";
import { Api } from '../../services/api.ts';
import { useAlert } from '../../contexts/alert-context.tsx';
import LoadingButton from "../../components/loading_button/index.tsx";

interface InviteUserListProps {
    teamId: string;
    onComplete: () => void;
    isOwner: boolean;
    noOfFreeSlots: number;
}

function InviteUserList({ teamId, onComplete, isOwner, noOfFreeSlots }: InviteUserListProps) {
    const [loading, setLoading] = useState(false)
    const [emailsValidity, setEmailsValidity] = useState<boolean[]>([false])
    const [invites, setInvites] = useState<{
        role: string,
        email: string,
    }[]>([{ role: 'member', email: '' }])
    const [error, setError] = useState('')
    const alert = useAlert()

    const addNewLine = () => {
        setEmailsValidity(emailsValidity => ([...emailsValidity, false]))
        setInvites(invites => ([...invites, { role: 'member', email: '' }]))
    }

    const onEmailChanged= (index: number, field: string, value: string) => {
        let isValid = false
        if (validateEmail(value)) {
            isValid = true
        }
        setInvites(invites => {
            return [
                ...invites.slice(0, index),
                { ...invites[index], [field]: value },
                ...invites.slice(index + 1)
            ]
        })
        setEmailsValidity(emailsValidity => ([
            ...emailsValidity.slice(0, index),
            isValid,
            ...emailsValidity.slice(index + 1)
        ]))
    }

    const onItemChanged = (index: number, field: string, value: string) => {
        setInvites(invites => {
            return [
                ...invites.slice(0, index),
                { ...invites[index], [field]: value },
                ...invites.slice(index + 1)
            ]
        })
    }

    const onRemove = (index: number) => {
        setInvites(invites => {
            return [
                ...invites.slice(0, index),
                ...invites.slice(index + 1)
            ]
        })
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[\w.-/+]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    const sendInvites = async () => {
        setError("")
        const emailsValid = invites.map(invite => validateEmail(invite.email))
        if (emailsValid.includes(false)) {
            setError('Invalid email in request')
            return
        }
        try {
            setLoading(true)
            const requestBody = invites.map(invite => ({ email: invite.email, role: invite.role }))
            await Api.bulkInviteUser(teamId, requestBody)
            onComplete()
            setInvites([{ email: '', role: 'member' }])
        } catch (err) {
            if (err?.response?.status === 400) {
                if (err?.response?.data?.code === "E01") {
                    alert.showAlert(err?.response?.data?.message)
                    setError(err?.response?.data?.message)
                } else {
                    const errors = err?.response?.data?.email
                    setError(errors[0])
                }
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <Box>
            {noOfFreeSlots > 0 && invites.map((item, index) => (
                <InviteUserLine key={index} email={item.email} role={item.role}
                    onEmailChanged={(email) => onEmailChanged(index, 'email', email)}
                    onRoleChanged={(role) => onItemChanged(index, 'role', role)}
                    onRemove={() => { onRemove(index) }}
                    isOwner={isOwner}
                ></InviteUserLine>
            ))}
            <Box sx={{ color: 'red' }}>{error}</Box>
            {noOfFreeSlots > 0 ? <>
                <Button sx={{ marginRight: '1rem', textTransform: 'none' }} onClick={() => addNewLine()}> + Add new row</Button>
            </> : <span>You have no remaining seats in your team, please upgrade your subscription to add more seats.</span>}

            <br /><br />
            {noOfFreeSlots > 0 && <LoadingButton disabled={emailsValidity.findIndex(validity => !validity) > -1} variant="contained" isLoading={loading} onClick={() => sendInvites()}> Send invites </LoadingButton>}
        </Box>
    );
}

export default InviteUserList;
