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
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CategoryList = ({ categories, onEdit, onDelete, loading }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Display Order</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                {loading ? 'Loading...' : 'No categories found'}
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.categoryId}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || '-'}</TableCell>
                <TableCell>{category.displayOrder}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(category)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(category.categoryId)}
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

export default CategoryList;

