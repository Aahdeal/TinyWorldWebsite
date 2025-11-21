import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ORDER_STATUS } from '../../utils/constants';

const OrderCard = ({ order, onViewDetails }) => {
  const statusColor = {
    PENDING_PAYMENT: 'warning',
    PAID: 'info',
    PROCESSING: 'primary',
    SHIPPED: 'secondary',
    DELIVERED: 'success',
    CANCELLED: 'error',
  }[order.status] || 'default';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order #{order.orderId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(order.orderDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: {order.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {order.cellno}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delivery: {order.deliveryMethod}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={ORDER_STATUS[order.status] || order.status}
              color={statusColor}
              sx={{ mb: 1 }}
            />
            <Typography variant="h6" color="primary">
              R {order.totalCost?.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.totalQuantity} item(s)
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton color="primary" onClick={() => onViewDetails(order)}>
            <VisibilityIcon />
            View Details
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;

