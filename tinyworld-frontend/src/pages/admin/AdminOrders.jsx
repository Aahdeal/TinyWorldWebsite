import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink
} from '@/components/ui/pagination';
import AdminNavbar from '../../components/admin/AdminNavbar';
import OrderStatusFilter from '../../components/admin/OrderStatusFilter';
import OrderCard from '../../components/admin/OrderCard';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import CreateOrderForm from '../../components/admin/CreateOrderForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { adminService } from '../../services/adminService';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus, page, size]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOrders(selectedStatus, page, size, true);
      
      // Handle paginated response
      if (data.content) {
        setOrders(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setHasNext(data.hasNext);
        setHasPrevious(data.hasPrevious);
      } else {
        // Fallback for non-paginated response
        setOrders(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load orders: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setPage(0); // Reset to first page when filtering
  };

  const handleViewDetails = async (order) => {
    try {
      const fullOrder = await adminService.getOrderById(order.orderId);
      setSelectedOrder(fullOrder);
      setShowDetailsModal(true);
    } catch (err) {
      setError('Failed to load order details: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      setError(null);
      await adminService.updateOrderStatus(orderId, newStatus);
      setSuccess('Order status updated successfully');
      setShowDetailsModal(false);
      setSelectedOrder(null);
      loadOrders();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update order status: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const handleOrderCreated = () => {
    setShowCreateModal(false);
    setSuccess('Order created successfully');
    setPage(0); // Reset to first page
    loadOrders();
    setTimeout(() => setSuccess(null), 3000);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing size
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>
        <Button onClick={handleCreateOrder} size="default">
          <Plus className="mr-2 h-4 w-4" />
          Create Order
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

      <OrderStatusFilter
        currentStatus={selectedStatus}
        onStatusChange={handleStatusFilter}
      />

      {/* Page Size Selector */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium">Items per page:</label>
        <select
          value={size}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        {totalElements > 0 && (
          <span className="text-sm text-muted-foreground">
            Showing {page * size + 1} - {Math.min((page + 1) * size, totalElements)} of {totalElements} orders
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No orders found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPrevious}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 0 ||
                    pageNum === totalPages - 1 ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pageNum === page}
                          className="cursor-pointer"
                        >
                          {pageNum + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return (
                      <PaginationItem key={pageNum}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNext}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <OrderDetailsModal
        order={selectedOrder}
        open={showDetailsModal}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
        loading={updating}
      />

      <Dialog open={showCreateModal} onOpenChange={(open) => !open && setShowCreateModal(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <CreateOrderForm
            onSuccess={handleOrderCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;

