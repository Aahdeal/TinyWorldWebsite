import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { categoryService } from '../../services/categoryService';
import { API_BASE_URL } from '../../utils/constants';

const ProductForm = ({ product, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    basePrice: '',
    displayOrder: 0,
    isActive: true,
  });
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
    if (product) {
      setFormData({
        categoryId: product.categoryId || '',
        name: product.name || '',
        description: product.description || '',
        basePrice: product.basePrice || '',
        displayOrder: product.displayOrder || 0,
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
      if (product.imageUrl) {
        setImagePreview(API_BASE_URL.replace('/api', '') + product.imageUrl);
      }
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      // Validate file type
      if (!file.type.match('image/(jpg|jpeg|png|gif)')) {
        setError('Please upload a JPG, PNG, or GIF image');
        return;
      }
      setImageFile(file);
      setError(null);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const submitData = {
      categoryId: Number(formData.categoryId),
      name: formData.name,
      description: formData.description,
      basePrice: parseFloat(formData.basePrice),
      displayOrder: parseInt(formData.displayOrder),
      isActive: formData.isActive,
    };

    onSubmit(submitData, imageFile);
  };

  if (loadingCategories) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {product ? 'Edit Product' : 'Create New Product'}
      </Typography>
      
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="name"
            label="Product Name"
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
            name="basePrice"
            label="Base Price"
            type="number"
            value={formData.basePrice}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ step: '0.01', min: '0.01' }}
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

          <FormControlLabel
            control={
              <Switch
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            }
            label="Active"
          />

          <Box>
            <Typography variant="body2" gutterBottom>
              Product Image
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" fullWidth>
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </Button>
            </label>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : product ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default ProductForm;

