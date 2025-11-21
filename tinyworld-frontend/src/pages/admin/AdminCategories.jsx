import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminNavbar from '../../components/admin/AdminNavbar';
import CategoryList from '../../components/admin/CategoryList';
import CategoryForm from '../../components/admin/CategoryForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { adminService } from '../../services/adminService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will fail if there are products in this category.')) {
      return;
    }

    try {
      await adminService.deleteCategory(categoryId);
      setSuccess('Category deleted successfully');
      loadCategories();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete category: ' + (err.response?.data?.error || err.message));
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (categoryData) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingCategory) {
        await adminService.updateCategory(editingCategory.categoryId, categoryData);
        setSuccess('Category updated successfully');
      } else {
        await adminService.createCategory(categoryData);
        setSuccess('Category created successfully');
      }

      setShowForm(false);
      setEditingCategory(null);
      loadCategories();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save category: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Category Management</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={handleCreate} size="default">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
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

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Dialog open={showForm} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;

