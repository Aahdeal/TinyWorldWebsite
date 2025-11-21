import api from './api';

export const adminService = {
  // Product Management
  getAllProducts: async () => {
    const response = await api.get('/admin/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (productData, imageFile) => {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await api.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData, imageFile) => {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await api.put(`/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  deleteProductImage: async (id) => {
    const response = await api.delete(`/admin/products/${id}/image`);
    return response.data;
  },

  // Category Management
  getAllCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Order Management
  getAllOrders: async (status = null, page = 0, size = 10, paginated = false) => {
    const params = { 
      page, 
      size, 
      paginated: paginated.toString()
    };
    if (status) {
      params.status = status;
    }
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/admin/orders', orderData);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },
};

