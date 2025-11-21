import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { ORDER_STATUS } from '../../utils/constants';

const STATUS_OPTIONS = [
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const OrderDetailsModal = ({ order, open, onClose, onStatusUpdate, loading }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || '');
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const handleStatusUpdate = () => {
    if (selectedStatus === order.status) {
      onClose();
      return;
    }

    try {
      onStatusUpdate(order.orderId, selectedStatus);
    } catch (err) {
      setError('Failed to update status: ' + (err.response?.data?.error || err.message));
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Order #{order.orderId} Details
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Customer Information</Typography>
          <Typography variant="body2"><strong>Email:</strong> {order.email}</Typography>
          <Typography variant="body2"><strong>Phone:</strong> {order.cellno}</Typography>
          <Typography variant="body2"><strong>Delivery Method:</strong> {order.deliveryMethod}</Typography>
          <Typography variant="body2"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Order Items</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Personalization</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item) => (
                  <TableRow key={item.orderItemId}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.categoryName || '-'}</TableCell>
                    <TableCell>
                      {item.personalizationType !== 'NONE' 
                        ? `${item.personalizationType}: ${item.personalizationValue || '-'}`
                        : 'None'}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">R {item.unitPrice?.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      R {(item.quantity * item.unitPrice)?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="h6">Total: R {order.totalCost?.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>Update Status</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Order Status"
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {ORDER_STATUS[status] || status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={handleStatusUpdate}
          variant="contained"
          disabled={loading || selectedStatus === order.status}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;

