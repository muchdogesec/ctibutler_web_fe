import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import { Group, Api, SupportAgent, Search } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './navbar.tsx';
import { TeamContext } from '../../contexts/team-context.tsx';
import { URLS } from '../../services/urls.ts';
import './index.css';


const drawerWidth = 240;
const CTIBUTLER_API_SWAGGER_URL = process.env.REACT_APP_CTIBUTLER_API_SWAGGER_URL
const TAXII_SWAGGER_URL = process.env.REACT_APP_TAXII_SWAGGER_URL


const DashboardLayout = () => {
  const { activeTeam } = useContext(TeamContext);
  const [activeTeamId, setActiveTeamId] = useState('')
  const { logout, isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    setActiveTeamId(activeTeam?.id)
  }, [activeTeam])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/')
  }, [isLoading, isAuthenticated])

  return (
    <Box>
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 6rem)' }}>
        <NavBar></NavBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              height: 'calc(100vh - 6rem)'
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar sx={{ background: '#0073ec' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%', width: '100%' }}>
              <NavLink to={URLS.teamManagement(activeTeamId)}>
                <img alt='logo' style={{ width: '200px', display: 'block' }} src="/ctibutler-logo.png" />
              </NavLink>
            </div>
          </Toolbar>
          <Divider />
          <List>
            {(<>
              <ListItem component={NavLink} to={URLS.mitreAttacks('attack-enterprise')}>
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="MITRE ATT&CK Enterprise" />
              </ListItem>
              <ListItem component={NavLink} to={URLS.mitreAttacks('attack-ics')}>
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="MITRE ATT&CK ICS" />
              </ListItem>
              <ListItem component={NavLink} to={URLS.mitreAttacks('attack-mobile')}>
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="MITRE ATT&CK Mobile" />
              </ListItem>
              <ListItem component={NavLink} to={URLS.mitreAttacks('capec')}>
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="MITRE CAPEC" />
              </ListItem>
              <ListItem component={NavLink} to={URLS.mitreAttacks('cwe')}>
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="MITRE CWE" />
              </ListItem>
              <ListItem component={NavLink} to={URLS.mitreAttacks('disarm')}>
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="DISARM" />
              </ListItem>
              <ListItem component={NavLink} to={URLS.mitreAttacks('atlas')}>
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="MITRE ATLAS" />
              </ListItem>
              <ListItem component={NavLink} to={URLS.mitreAttacks('location')}>
                <ListItemIcon><Search /></ListItemIcon>
                <ListItemText primary="Location" />
              </ListItem>
              <ListItem button component={NavLink} to={CTIBUTLER_API_SWAGGER_URL}>
                <ListItemIcon><Api /></ListItemIcon>
                <ListItemText primary="API Docs" />
              </ListItem>
              <ListItem target='_blank' component={NavLink} to={TAXII_SWAGGER_URL}>
                <ListItemIcon><Api /></ListItemIcon>
                <ListItemText primary="TAXII API Docs" />
              </ListItem>
              <ListItem component={NavLink} to={URLS.mitreAttacks()}>
                <ListItemIcon><Api /></ListItemIcon>
                <ListItemText primary="Mitre Att&cks" />
              </ListItem>
              {activeTeam?.is_admin && (
                <ListItem button component={NavLink} to={URLS.teamManagement(activeTeamId)}>
                  <ListItemIcon><Group /></ListItemIcon>
                  <ListItemText primary="Team Management" />
                </ListItem>
              )}
              <ListItem button component={NavLink} target='_blank' to="https://support.dogesec.com/">
                <ListItemIcon><SupportAgent /></ListItemIcon>
                <ListItemText primary="Support" />
              </ListItem>
            </>)}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <Box sx={{}}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <Box className='footer'>
        <Typography>
          Built by the <a href='https://www.dogesec.com/' target='_blank' rel="noreferrer">DOGESEC</a> team. Copyright {new Date().getFullYear()}.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
