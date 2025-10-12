import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Acceso Denegado
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        No tienes permiso para ver esta página.
      </Typography>
      <Link to="/">Volver al inicio</Link>
    </Box>
  );
};

export default Unauthorized;