import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Logo } from './Logo';

const navItems = [
  { text: 'Home', path: '/' },
  { text: 'About', path: '/about' },
  { text: 'Services', path: '/services' },
  { text: 'Compliance AI', path: '/compliance-assistant' },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {navItems.map((item) => (
        <ListItem 
          key={item.text} 
          component={RouterLink} 
          to={item.path}
          onClick={handleDrawerToggle}
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }} 
        elevation={0}
      >
        <Toolbar>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Logo height={180} />
          </Box>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    mx: 1,
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                    '&.active': {
                      color: 'primary.main',
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
