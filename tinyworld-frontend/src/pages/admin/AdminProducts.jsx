import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ProductList from '../../components/admin/ProductList';
import ProductForm from '../../components/admin/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { adminService } from '../../services/adminService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await adminService.deleteProduct(productId);
      setSuccess('Product deleted successfully');
      loadProducts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete product: ' + (err.response?.data?.error || err.message));
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (productData, imageFile) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.productId, productData, imageFile);
        setSuccess('Product updated successfully');
      } else {
        await adminService.createProduct(productData, imageFile);
        setSuccess('Product created successfully');
      }

      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save product: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Product Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={handleCreate} size="default">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <AdminNavbar />

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-destructive hover:text-destructive/80">
              ×
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400">
          <div className="flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-700 dark:text-green-400 hover:opacity-80">
              ×
            </button>
          </div>
        </div>
      )}

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Dialog open={showForm} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;

