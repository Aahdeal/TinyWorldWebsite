import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabValue = () => {
    if (location.pathname === '/admin' || location.pathname === '/admin/dashboard') return 'dashboard';
    if (location.pathname === '/admin/products') return 'products';
    if (location.pathname === '/admin/categories') return 'categories';
    if (location.pathname === '/admin/orders') return 'orders';
    return 'dashboard';
  };

  const handleTabChange = (value) => {
    switch (value) {
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'products':
        navigate('/admin/products');
        break;
      case 'categories':
        navigate('/admin/categories');
        break;
      case 'orders':
        navigate('/admin/orders');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  return (
    <div className="mb-6 border-b pb-4">
      <Tabs value={getTabValue()} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdminNavbar;

