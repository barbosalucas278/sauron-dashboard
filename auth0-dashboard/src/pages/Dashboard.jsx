import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import Profile from '../components/Profile';

// Component to fetch and display user action history
const UserActions = ({ userId }) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchActions = async () => {
      try {
        const response = await fetch(`/api/user-history?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user history');
        }
        const data = await response.json();
        setActions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [userId]);

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Historial de Acciones
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="warning">No se pudo cargar el historial de acciones. El administrador debe configurar las credenciales de la API de Auth0.</Alert>}
      {!loading && !error && (
        <List>
          {actions.length > 0 ? (
            actions.map((item, index) => (
              <React.Fragment key={item.log_id || index}>
                <ListItem>
                  <ListItemText primary={item.type} secondary={`${item.details?.description || ''} - ${new Date(item.date).toLocaleString()}`} />
                </ListItem>
                {index < actions.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Typography>No se encontró historial de acciones.</Typography>
          )}
        </List>
      )}
    </Paper>
  );
};

// Component to fetch and display linked accounts
const LinkedAccounts = ({ userId }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAccounts = async () => {
      try {
        const response = await fetch(`/api/linked-accounts?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch linked accounts');
        }
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [userId]);

  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Perfiles Vinculados
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="warning">No se pudieron cargar los perfiles vinculados. El administrador debe configurar las credenciales de la API de Auth0.</Alert>}
      {!loading && !error && (
        <List>
          {accounts.length > 0 ? (
            accounts.map((account, index) => (
              <React.Fragment key={account.user_id || index}>
                <ListItem>
                  <ListItemText primary={account.provider} secondary={`User ID: ${account.user_id}`} />
                </ListItem>
                {index < accounts.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Typography>No se encontraron perfiles vinculados.</Typography>
          )}
        </List>
      )}
    </Paper>
  );
};

const Dashboard = () => {
  const { user } = useAuth0();
  // user.sub is the unique identifier for the user in Auth0, which is what the Management API needs.
  const userId = user?.sub;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Bienvenido, {user.name}
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Profile />
      </Grid>
      <Grid item xs={12} md={8}>
        <UserActions userId={userId} />
        <LinkedAccounts userId={userId} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;