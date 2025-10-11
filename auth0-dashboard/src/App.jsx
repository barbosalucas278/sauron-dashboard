import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import Dashboard from './pages/Dashboard'; // I will create this page next

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENTID;
  console.log(domain);
  console.log(clientId);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Auth0 Dashboard
          </Typography>
          {isAuthenticated && <LogoutButton />}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {!isAuthenticated ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h4" gutterBottom>
              Bienvenido
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Por favor, inicia sesión para continuar.
            </Typography>
            <LoginButton />
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        )}
      </Container>
    </Router>
  );
};

export default App;