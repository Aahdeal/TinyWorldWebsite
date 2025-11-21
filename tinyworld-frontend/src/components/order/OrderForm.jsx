import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { DELIVERY_METHODS, PERSONALIZATION_TYPES } from '../../utils/constants';
import PersonalizationOptions from './PersonalizationOptions';
import OrderSummary from './OrderSummary';

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([
    {
      productId: '',
      quantity: 1,
      personalizationType: 'NONE',
      personalizationValue: '',
    },
  ]);
  const [email, setEmail] = useState('');
  const [cellno, setCellno] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProducts();
    
    // Check if product was selected from gallery
    if (location.state?.selectedProduct) {
      const product = location.state.selectedProduct;
      setOrderItems([{
        productId: product.productId,
        quantity: 1,
        personalizationType: 'NONE',
        personalizationValue: '',
      }]);
    }
  }, [isAuthenticated, navigate, location]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        productId: '',
        quantity: 1,
        personalizationType: 'NONE',
        personalizationValue: '',
      },
    ]);
  };

  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // Reset personalization value if type changes to NONE
    if (field === 'personalizationType' && value === 'NONE') {
      updated[index].personalizationValue = '';
    }
    
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find(p => p.productId === item.productId);
      if (!product) return total;
      
      const personalization = PERSONALIZATION_TYPES.find(
        p => p.value === item.personalizationType
      );
      const unitPrice = product.basePrice + (personalization?.price || 0);
      return total + unitPrice * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (orderItems.some(item => !item.productId)) {
      setError('Please select a product for all items');
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
        items: orderItems.map(item => ({
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Order Request
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Order Items
          </Typography>

          {orderItems.map((item, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={item.productId}
                      label="Product"
                      onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                      required
                    >
                      {products.map((product) => (
                        <MenuItem key={product.productId} value={product.productId}>
                          {product.name} - R{product.basePrice?.toFixed(2)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  {orderItems.length > 1 && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => removeOrderItem(index)}
                      fullWidth
                      sx={{ height: '56px' }}
                    >
                      Remove
                    </Button>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <PersonalizationOptions
                    value={item.personalizationType}
                    personalizationValue={item.personalizationValue}
                    onChange={(type, value) => {
                      updateOrderItem(index, 'personalizationType', type);
                      updateOrderItem(index, 'personalizationValue', value);
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addOrderItem}
            sx={{ mb: 3 }}
          >
            Add Another Item
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Contact Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cell Number"
                value={cellno}
                onChange={(e) => setCellno(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
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
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <OrderSummary
            orderItems={orderItems}
            products={products}
            total={calculateTotal()}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Order'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderForm;

