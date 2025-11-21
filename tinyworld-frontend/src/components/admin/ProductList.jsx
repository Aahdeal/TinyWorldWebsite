import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { API_BASE_URL } from '../../utils/constants';

const ProductList = ({ products, onEdit, onDelete, loading }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Display Order</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {loading ? 'Loading...' : 'No products found'}
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>
                  {product.imageUrl ? (
                    <Avatar
                      src={API_BASE_URL.replace('/api', '') + product.imageUrl}
                      alt={product.name}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 56, height: 56 }}>
                      No Image
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categoryName || 'N/A'}</TableCell>
                <TableCell>R {product.basePrice?.toFixed(2)}</TableCell>
                <TableCell>{product.displayOrder}</TableCell>
                <TableCell>
                  <Chip
                    label={product.isActive ? 'Active' : 'Inactive'}
                    color={product.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(product)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(product.productId)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;

