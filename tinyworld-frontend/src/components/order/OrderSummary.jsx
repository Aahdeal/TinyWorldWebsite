import React from 'react';
import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PERSONALIZATION_TYPES } from '../../utils/constants';

const OrderSummary = ({ orderItems, products, total }) => {
  const getItemDetails = (item) => {
    const product = products.find(p => p.productId === item.productId);
    if (!product) return null;

    const personalization = PERSONALIZATION_TYPES.find(
      p => p.value === item.personalizationType
    );
    const unitPrice = product.basePrice + (personalization?.price || 0);
    const itemTotal = unitPrice * item.quantity;

    return {
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      itemTotal,
      personalizationType: item.personalizationType,
      personalizationValue: item.personalizationValue,
    };
  };

  const validItems = orderItems
    .map(item => getItemDetails(item))
    .filter(item => item !== null);

  if (validItems.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {validItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {item.productName}
                  {item.personalizationType !== 'NONE' && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {item.personalizationType}: {item.personalizationValue}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">R{item.unitPrice.toFixed(2)}</TableCell>
                <TableCell align="right">R{item.itemTotal.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography variant="h6">Total</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6">R{total.toFixed(2)}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderSummary;

