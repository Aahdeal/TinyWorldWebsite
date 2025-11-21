import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import OrderHistory from './OrderHistory';

const Account = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState({
    name: '',
    surname: '',
    cellno: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile({
        name: data.name || '',
        surname: data.surname || '',
        cellno: data.cellno || '',
        email: data.email || '',
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await userService.updateProfile(profile);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Account
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Logged in as: {user?.email}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Profile" />
            <Tab label="Orders" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Surname"
                  value={profile.surname}
                  onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cell Number"
                  value={profile.cellno}
                  onChange={(e) => setProfile({ ...profile, cellno: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  sx={{ mt: 2 }}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && <OrderHistory />}
      </Paper>
    </Container>
  );
};

export default Account;

