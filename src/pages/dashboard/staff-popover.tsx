import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { List, ListItem, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { ArrowDropDown } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';
import { URLS } from '../../services/urls.ts';

const CTIBUTLET_ADMIN_URL = process.env.REACT_APP_CTIBUTLET_ADMIN_URL || '/admin'

export default function StaffPopover() {
    const { logout } = useAuth0()
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <Button sx={{ textTransform: 'none', boxShadow: 'none', height: '60px', background: 'transaparent' }} aria-describedby={id} variant="contained" onClick={handleClick}>
                <Typography>Staff Actions</Typography>
                <ArrowDropDown></ArrowDropDown>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <List>
                    <ListItem component={NavLink} to={URLS.staffUserList()}>
                        <ListItemText primary="Manage Users" />
                    </ListItem>
                    <ListItem component={NavLink} to={URLS.staffTeamList()}>
                        <ListItemText primary="Manage Teams" />
                    </ListItem>
                    <ListItem>
                        <a href={CTIBUTLET_ADMIN_URL} style={{ textDecoration: 'none' }}>
                            <ListItemText primary="Access Django Staff Area" />
                        </a>
                    </ListItem>
                </List>
            </Popover>
        </>
    );
}
