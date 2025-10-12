import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // IMPORTANT: The namespace for the custom claim must match the one in the Auth0 Action.
  // I will provide instructions for this later.
  const namespace = 'https://sauron-dashboard-bay.vercel.app/';
  const roles = user?.[`${namespace}roles`];

  const isAdmin = roles?.includes('Admin');

  if (isAdmin) {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;