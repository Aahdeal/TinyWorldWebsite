import React, { createContext, useContext, useState, useEffect } from 'react';
import { PERSONALIZATION_TYPES } from '../utils/constants';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate and clean cart items - remove items with invalid products
        const validCart = parsedCart.filter(item => 
          item && 
          item.product && 
          item.product.productId && 
          item.product.basePrice !== undefined
        );
        setCartItems(validCart);
        // Update localStorage if items were removed
        if (validCart.length !== parsedCart.length) {
          localStorage.setItem('cart', JSON.stringify(validCart));
        }
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('cart');
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, personalizationType = 'NONE', personalizationValue = '', quantity = 1) => {
    const cartItem = {
      id: `${product.productId}-${personalizationType}-${Date.now()}`, // Unique ID for cart item
      productId: product.productId,
      product: product, // Store full product object
      quantity: quantity,
      personalizationType: personalizationType,
      personalizationValue: personalizationValue,
    };

    setCartItems((prevItems) => [...prevItems, cartItem]);
    return cartItem;
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateCartItem = (itemId, updates) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, { quantity });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => {
      if (!item || !item.quantity) return total;
      return total + item.quantity;
    }, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item || !item.product || item.product.basePrice === undefined) {
        return total;
      }
      const personalization = PERSONALIZATION_TYPES.find(
        (p) => p.value === item.personalizationType
      );
      const unitPrice = item.product.basePrice + (personalization?.price || 0);
      return total + unitPrice * item.quantity;
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

