import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography variant="h5" color="error">
          Error de autenticación
        </Typography>
        <Typography variant="body1">
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <>
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
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        )}
      </Container>
    </>
  );
};

export default App;