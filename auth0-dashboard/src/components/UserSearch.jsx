import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!query) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const response = await fetch(`/api/users-search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Buscar Usuarios
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Email o Nombre"
                    variant="outlined"
                    fullWidth
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="contained" onClick={handleSearch} disabled={loading}>
                    Buscar
                </Button>
            </Box>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            <List>
                {results.map((user) => (
                    <ListItem key={user.user_id}>
                        <ListItemAvatar>
                            <Avatar src={user.picture} alt={user.name} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.name || user.email}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="text.primary">
                                        {user.email}
                                    </Typography>
                                    {` — Último login: ${user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}`}
                                </>
                            }
                        />
                    </ListItem>
                ))}
                {!loading && results.length === 0 && query && !error && (
                    <Typography variant="body2" color="text.secondary">
                        No se encontraron resultados.
                    </Typography>
                )}
            </List>
        </Paper>
    );
};

export default UserSearch;
