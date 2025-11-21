import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const status = statusFilter === 'ALL' ? null : statusFilter;
      const data = await adminService.getAllOrders(status);
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by date
  const getFilteredOrders = () => {
    let filtered = [...orders];

    if (dateFilter !== 'ALL') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'TODAY':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate || order.createdAt);
            return orderDate >= filterDate;
          });
          break;
        case 'WEEK':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate || order.createdAt);
            return orderDate >= filterDate;
          });
          break;
        case 'MONTH':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate || order.createdAt);
            return orderDate >= filterDate;
          });
          break;
        default:
          break;
      }
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Calculate total cost from order items or use stored totalCost
  const calculateOrderTotalCost = (order) => {
    // First try to use the stored totalCost
    if (order.totalCost !== undefined && order.totalCost !== null) {
      return parseFloat(order.totalCost) || 0;
    }
    
    // Fallback: calculate from order items
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      return order.items.reduce((total, item) => {
        const unitPrice = parseFloat(item.unitPrice || 0);
        const quantity = parseInt(item.quantity || 0);
        return total + (unitPrice * quantity);
      }, 0);
    }
    
    // Last fallback: try other fields
    return parseFloat(order.totalAmount || order.total || 0) || 0;
  };

  // Calculate metrics
  const totalOrders = filteredOrders.length;
  
  // Status-based categorization
  // Revenue: Only DELIVERED orders (completed transactions)
  const revenueOrders = filteredOrders.filter(o => o.status === 'DELIVERED');
  const completedOrders = revenueOrders.length;
  
  // Outstanding: PENDING_PAYMENT, PAID, PROCESSING, SHIPPED (awaiting completion)
  const outstandingOrders = filteredOrders.filter(o => 
    o.status === 'PENDING_PAYMENT' || 
    o.status === 'PAID' || 
    o.status === 'PROCESSING' ||
    o.status === 'SHIPPED'
  );
  const pendingOrders = outstandingOrders.length;

  // Calculate totals
  const totalRevenue = revenueOrders.reduce((total, order) => {
    return total + calculateOrderTotalCost(order);
  }, 0);

  const outstandingAmount = outstandingOrders.reduce((total, order) => {
    return total + calculateOrderTotalCost(order);
  }, 0);
  
  // Total cost of all orders (excluding cancelled)
  const totalCost = filteredOrders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((total, order) => {
      return total + calculateOrderTotalCost(order);
    }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const kpiCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      subtitle: `${completedOrders} completed`,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      subtitle: 'From completed orders',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Outstanding Amount',
      value: formatCurrency(outstandingAmount),
      subtitle: `${pendingOrders} pending orders`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Completion Rate',
      value: totalOrders > 0 ? `${Math.round((completedOrders / totalOrders) * 100)}%` : '0%',
      subtitle: 'Orders completed',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  // Status breakdown
  const statusBreakdown = filteredOrders.reduce((acc, order) => {
    const status = order.status || 'UNKNOWN';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your orders and revenue metrics</p>
      </div>

      <AdminNavbar />

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING_PAYMENT">Pending Payment</option>
          <option value="PAID">Paid</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="ALL">All Time</option>
          <option value="TODAY">Today</option>
          <option value="WEEK">Last 7 Days</option>
          <option value="MONTH">Last 30 Days</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/orders')}
          className="ml-auto"
        >
          View All Orders
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-4 p-6">
                  <div className="flex-1">
                    <p className="text-2xl md:text-3xl font-bold mb-1">{kpi.value}</p>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  </div>
                  <div className={`${kpi.bgColor} rounded-lg p-3`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
                <Separator />
                <div className="bg-muted/20 px-6 py-3">
                  <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
            <div className="space-y-3">
              {Object.entries(statusBreakdown).length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders found</p>
              ) : (
                Object.entries(statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {status.toLowerCase()}
                      </Badge>
                    </div>
                    <span className="text-lg font-semibold">{count}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/orders')}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Manage Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/products')}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/admin/categories')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

