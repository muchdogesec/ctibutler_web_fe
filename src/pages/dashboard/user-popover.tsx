import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowDropDown } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';
import { URLS } from '../../services/urls.ts';


export default function UserPopover({ userEmail }: { userEmail: string }) {
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
        // <div>
        <>
            <Button sx={{ textTransform: 'none', boxShadow: 'none', height: '60px', background: 'transparent' }} aria-describedby={id} variant="contained" onClick={handleClick}>
                <Typography>{userEmail}</Typography>
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
                    <ListItem>
                        <Link to={URLS.profile()}>
                            <Button sx={{textTransform: 'none', }}>
                                Account Settings
                            </Button>
                        </Link>
                    </ListItem>
                    <ListItem sx={{textTransform: 'none', }}>
                        <Button onClick={() => logout()} sx={{ textTransform: 'none' }}>
                            Logout
                        </Button>
                    </ListItem>
                </List>
            </Popover>
            {/* </div> */}
        </>
    );
}
