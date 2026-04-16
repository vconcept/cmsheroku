import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by the store
    }
  };

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            EduCMS
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Educational Content Management System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Register here
            </Link>
          </Typography>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              📋 Test Credentials:
            </Typography>
            <TableContainer>
              <Table size="small" sx={{ backgroundColor: 'transparent' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                    <TableCell sx={{ py: 1, fontWeight: 'bold', fontSize: '0.85rem' }}>Role</TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold', fontSize: '0.85rem' }}>Email</TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold', fontSize: '0.85rem' }}>Password</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem' }}>Admin</TableCell>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem' }}>admin@educms.com</TableCell>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem', fontFamily: 'monospace' }}>password123</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem' }}>Editor</TableCell>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem' }}>editor@educms.com</TableCell>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem', fontFamily: 'monospace' }}>password123</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem' }}>Author</TableCell>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem' }}>author1@educms.com</TableCell>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem', fontFamily: 'monospace' }}>password123</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem' }}>Subscriber</TableCell>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem' }}>subscriber@educms.com</TableCell>
                    <TableCell sx={{ py: 0.8, fontSize: '0.85rem', fontFamily: 'monospace' }}>password123</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Alert>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
