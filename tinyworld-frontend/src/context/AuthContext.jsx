import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = {
        userId: response.userId,
        email: response.email,
        role: response.role,
      };
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await authService.register(email, password);
      const userData = {
        userId: response.userId,
        email: response.email,
        role: response.role,
      };
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

