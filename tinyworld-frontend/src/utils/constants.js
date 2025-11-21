export const API_BASE_URL = 'http://localhost:8080/api';

export const DELIVERY_METHODS = [
  { value: 'collection-CR', label: 'Collection - City Rock Cape Town' },
  { value: 'collection-B11PE', label: 'Collection - Bloc11 Paarden Eiland' },
  { value: 'collection-B11DR', label: 'Collection - Bloc11 Dipe River' },
  { value: 'delivery', label: 'Delivery (additional fee)' }
];

export const PERSONALIZATION_TYPES = [
  { value: 'NONE', label: 'Normal Shoe', price: 0 },
  { value: 'INITIAL', label: 'Add Initial', price: 20 },
  { value: 'NAME', label: 'Add Name', price: 30 }
];

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'Pending Payment',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

