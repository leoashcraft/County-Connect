import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        const userData = await authService.me();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (provider = 'google', nextUrl) => {
    authService.login(provider, nextUrl);
  };

  const logout = async (redirectUrl) => {
    await authService.logout(redirectUrl);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (data) => {
    const updatedUser = await authService.updateMe(data);
    setUser(updatedUser);
    return updatedUser;
  };

  const refreshUser = async () => {
    const userData = await authService.me();
    setUser(userData);
    return userData;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUser,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
