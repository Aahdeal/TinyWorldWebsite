import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const STATUS_OPTIONS = [
  { value: null, label: 'All Orders' },
  { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const OrderStatusFilter = ({ currentStatus, onStatusChange }) => {
  const getTabIndex = () => {
    const index = STATUS_OPTIONS.findIndex(opt => opt.value === currentStatus);
    return index >= 0 ? index : 0;
  };

  const handleTabChange = (event, newValue) => {
    onStatusChange(STATUS_OPTIONS[newValue].value);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={getTabIndex()} onChange={handleTabChange} aria-label="order status filter tabs" variant="scrollable" scrollButtons="auto">
        {STATUS_OPTIONS.map((option, index) => (
          <Tab key={option.value || 'all'} label={option.label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default OrderStatusFilter;

