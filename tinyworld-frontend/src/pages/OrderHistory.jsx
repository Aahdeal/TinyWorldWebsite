import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { orderService } from '../services/orderService';
import { ORDER_STATUS } from '../utils/constants';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const loadOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    try {
      const order = orders.find(o => o.orderId === orderId);
      if (order && order.items) {
        setExpandedOrder(orderId);
      } else {
        const details = await orderService.getOrderById(orderId);
        setOrders(orders.map(o => o.orderId === orderId ? details : o));
        setExpandedOrder(orderId);
      }
    } catch (err) {
      setError('Failed to load order details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'warning';
      case 'PAID':
      case 'PROCESSING':
        return 'info';
      case 'SHIPPED':
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No orders found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>

      {orders.map((order) => (
        <Accordion
          key={order.orderId}
          expanded={expandedOrder === order.orderId}
          onChange={() => loadOrderDetails(order.orderId)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mr: 2 }}>
              <Box>
                <Typography variant="subtitle1">
                  Order #{order.orderId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="h6">
                  R{order.totalCost?.toFixed(2)}
                </Typography>
                <Chip
                  label={ORDER_STATUS[order.status] || order.status}
                  color={getStatusColor(order.status)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {order.items && order.items.length > 0 && (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Personalization</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.orderItemId}>
                        <TableCell>
                          {item.productName}
                          {item.categoryName && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {item.categoryName}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.personalizationType !== 'NONE' ? (
                            <>
                              {item.personalizationType}: {item.personalizationValue}
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              None
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">R{item.unitPrice?.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          R{(item.unitPrice * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        <Typography variant="h6">Total</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">R{order.totalCost?.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Delivery Method:</strong> {order.deliveryMethod}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {order.email}
              </Typography>
              <Typography variant="body2">
                <strong>Cell Number:</strong> {order.cellno}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default OrderHistory;

