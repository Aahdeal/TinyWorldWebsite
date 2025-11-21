import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { DELIVERY_METHODS, PERSONALIZATION_TYPES } from '../utils/constants';
import { API_BASE_URL } from '../utils/constants';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const {
    cartItems = [],
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useCart();
  
  const [cartReady, setCartReady] = React.useState(false);

  const [email, setEmail] = useState(user?.email || '');
  const [cellno, setCellno] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);

  // Wait for auth and cart to be ready
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      setCartReady(true);
    }
  }, [authLoading, isAuthenticated]);

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [authLoading, isAuthenticated, navigate]);

  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);
  
  // Show loading while auth is loading or cart is initializing
  if (authLoading || !cartReady) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const calculateTotal = () => {
    return getCartTotal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    if (!email || !cellno || !deliveryMethod) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          personalizationType: item.personalizationType,
          personalizationValue: item.personalizationValue || null,
        })),
        email,
        cellno,
        deliveryMethod,
      };

      const response = await orderService.createOrder(orderData);
      setOrderResponse(response);
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success && orderResponse) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Order placed successfully! Order ID: {orderResponse.orderId}
          </Alert>

          <Typography variant="h5" gutterBottom>
            Payment Details
          </Typography>
          <Typography variant="body1" paragraph>
            Please make your payment to the following bank account and email the proof of payment (PoP) to the email address below:
          </Typography>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography><strong>Bank:</strong> Capitec Bank</Typography>
            <Typography><strong>Account Number:</strong> 1730075752</Typography>
            <Typography><strong>Account Type:</strong> Savings</Typography>
            <Typography><strong>Account Holder:</strong> Miss E Felic</Typography>
            <Typography><strong>Email for PoP:</strong> emily.tinyw0rld@gmail.com</Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Order Total: R{orderResponse.totalCost?.toFixed(2)}</Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate('/account')}
            sx={{ mt: 3 }}
          >
            View Order Status
          </Button>
        </Paper>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your cart is empty
          </Typography>
          <Button variant="contained" onClick={() => navigate('/gallery')}>
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.filter(item => item && item.product && item.product.basePrice !== undefined).map((item) => {
                    const personalization = PERSONALIZATION_TYPES.find(
                      (p) => p.value === item.personalizationType
                    );
                    const unitPrice = (item.product?.basePrice || 0) + (personalization?.price || 0);
                    const itemTotal = unitPrice * (item.quantity || 1);

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {item.product.imageUrl && (
                              <Box
                                component="img"
                                src={API_BASE_URL.replace('/api', '') + item.product.imageUrl}
                                alt={item.product.name}
                                sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                              />
                            )}
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {item.product.name}
                              </Typography>
                              {item.personalizationType !== 'NONE' && (
                                <Typography variant="caption" color="text.secondary">
                                  {personalization?.label}: {item.personalizationValue}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>R{unitPrice.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Remove />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">R{itemTotal.toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>R{calculateTotal().toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  R{calculateTotal().toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="subtitle1" gutterBottom>
                  Contact Information
                </Typography>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Cell Number"
                  value={cellno}
                  onChange={(e) => setCellno(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Delivery Method</InputLabel>
                  <Select
                    value={deliveryMethod}
                    label="Delivery Method"
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    required
                  >
                    {DELIVERY_METHODS.map((method) => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShoppingCart;

