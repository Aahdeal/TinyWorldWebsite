import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

const CategoryForm = ({ category, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        displayOrder: category.displayOrder || 0,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'displayOrder' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {category ? 'Edit Category' : 'Create New Category'}
      </Typography>
      
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="name"
            label="Category Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            name="displayOrder"
            label="Display Order"
            type="number"
            value={formData.displayOrder}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: '0' }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {category ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default CategoryForm;

