import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { DELIVERY_METHODS, PERSONALIZATION_TYPES, ORDER_STATUS } from '../../utils/constants';

const CreateOrderForm = ({ onSuccess, onCancel }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orderItems, setOrderItems] = useState([
    {
      productId: '',
      quantity: 1,
      personalizationType: 'NONE',
      personalizationValue: '',
    },
  ]);
  const [email, setEmail] = useState('');
  const [cellno, setCellno] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [status, setStatus] = useState('PENDING_PAYMENT');
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        adminService.getAllCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load products: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoadingProducts(false);
    }
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        productId: '',
        quantity: 1,
        personalizationType: 'NONE',
        personalizationValue: '',
      },
    ]);
  };

  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'personalizationType' && value === 'NONE') {
      updated[index].personalizationValue = '';
    }
    
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find(p => p.productId === item.productId);
      if (!product) return total;
      
      const personalization = PERSONALIZATION_TYPES.find(
        p => p.value === item.personalizationType
      );
      const unitPrice = (product.basePrice || 0) + (personalization?.price || 0);
      return total + unitPrice * item.quantity;
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (orderItems.some(item => !item.productId)) {
      setError('Please select a product for all items');
      setLoading(false);
      return;
    }

    if (orderItems.some(item => item.personalizationType !== 'NONE' && !item.personalizationValue)) {
      setError('Please enter personalization value for items that require it');
      setLoading(false);
      return;
    }

    if (!email || !cellno || !deliveryMethod) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        items: orderItems.map(item => ({
          productId: Number(item.productId),
          quantity: item.quantity,
          personalizationType: item.personalizationType,
          personalizationValue: item.personalizationValue || null,
        })),
        email,
        cellno,
        deliveryMethod,
        status,
      };

      await adminService.createOrder(orderData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Client Details */}
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="client@example.com"
            />
          </div>
          <div>
            <Label htmlFor="cellno">Cell Number *</Label>
            <Input
              id="cellno"
              type="tel"
              value={cellno}
              onChange={(e) => setCellno(e.target.value)}
              required
              placeholder="+27 82 123 4567"
            />
          </div>
          <div>
            <Label htmlFor="deliveryMethod">Delivery Method *</Label>
            <select
              id="deliveryMethod"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="">Select delivery method</option>
              {DELIVERY_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="status">Order Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {Object.entries(ORDER_STATUS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderItems.map((item, index) => {
            const selectedProduct = products.find(p => p.productId === Number(item.productId));
            const personalization = PERSONALIZATION_TYPES.find(p => p.value === item.personalizationType);
            const unitPrice = selectedProduct 
              ? (selectedProduct.basePrice || 0) + (personalization?.price || 0)
              : 0;
            
            return (
              <Card key={index} className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Item {index + 1}</h4>
                    {orderItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOrderItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Product *</Label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        <option value="">Select a product</option>
                        {categories.map((category) => {
                          const categoryProducts = products.filter(p => p.categoryId === category.categoryId);
                          if (categoryProducts.length === 0) return null;
                          return (
                            <optgroup key={category.categoryId} label={category.name}>
                              {categoryProducts.map((product) => (
                                <option key={product.productId} value={product.productId}>
                                  {product.name} - {formatCurrency(product.basePrice || 0)}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                        {/* Products without category */}
                        {products.filter(p => !p.categoryId || !categories.find(c => c.categoryId === p.categoryId)).length > 0 && (
                          <optgroup label="Uncategorized">
                            {products
                              .filter(p => !p.categoryId || !categories.find(c => c.categoryId === p.categoryId))
                              .map((product) => (
                                <option key={product.productId} value={product.productId}>
                                  {product.name} - {formatCurrency(product.basePrice || 0)}
                                </option>
                              ))}
                          </optgroup>
                        )}
                      </select>
                    </div>

                    <div>
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Personalization Type</Label>
                      <select
                        value={item.personalizationType}
                        onChange={(e) => updateOrderItem(index, 'personalizationType', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        {PERSONALIZATION_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label} {type.price > 0 && `(+${formatCurrency(type.price)})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {item.personalizationType !== 'NONE' && (
                      <div>
                        <Label>
                          {item.personalizationType === 'INITIAL' ? 'Initial' : 'Name'} *
                        </Label>
                        <Input
                          value={item.personalizationValue || ''}
                          onChange={(e) => updateOrderItem(index, 'personalizationValue', e.target.value)}
                          required={item.personalizationType !== 'NONE'}
                          placeholder={item.personalizationType === 'INITIAL' ? 'A' : 'John Doe'}
                          maxLength={item.personalizationType === 'INITIAL' ? 1 : undefined}
                        />
                      </div>
                    )}
                  </div>

                  {selectedProduct && (
                    <div className="text-sm text-muted-foreground">
                      Unit Price: {formatCurrency(unitPrice)} × {item.quantity} = {formatCurrency(unitPrice * item.quantity)}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={addOrderItem}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Item
          </Button>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
};

export default CreateOrderForm;

