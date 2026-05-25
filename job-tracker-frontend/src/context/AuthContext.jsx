/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

const getOAuthUserAndToken = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadStr);
        
        const oauthUser = {
          id: payload.sub,
          email: payload.email,
          firstName: payload.firstName || 'User',
          lastName: payload.lastName || '',
          role: payload.role || 'user',
        };
        
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(oauthUser));
        
        // Remove token from address bar
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        return oauthUser;
      }
    }
  } catch (err) {
    console.error('Failed to parse OAuth token:', err);
  }
  
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getOAuthUserAndToken());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await authApi.register(formData);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const { data } = await authApi.resetPassword({ email });
      return {
        success: true,
        previewUrl: data.previewUrl || '',
        resetLink: data.resetLink || '',
        devMode: data.devMode || false,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to send reset link',
      };
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isRecruiter = () => user?.role === 'recruiter';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, isAdmin, isRecruiter }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
