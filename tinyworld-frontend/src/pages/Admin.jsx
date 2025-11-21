import React from 'react';
import { Container, Typography, Box, Grid, Paper, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Category, Receipt } from '@mui/icons-material';
import AdminNavbar from '../components/admin/AdminNavbar';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Admin Dashboard
      </Typography>
      
      <AdminNavbar />
      
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/admin/products')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingBag sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5">Products</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage product catalog, prices, images, and availability
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/admin/categories')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Category sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5">Categories</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Create and manage product categories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/admin/orders')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Receipt sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5">Orders</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  View and manage customer orders and statuses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Admin;

