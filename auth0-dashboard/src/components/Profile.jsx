import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    isAuthenticated && (
      <Card sx={{ maxWidth: 345, margin: 'auto', mt: 4 }}>
        <CardMedia
          component="img"
          height="140"
          image={user.picture}
          alt={user.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </CardContent>
      </Card>
    )
  );
};

export default Profile;