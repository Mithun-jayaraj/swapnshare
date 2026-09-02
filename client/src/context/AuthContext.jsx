import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sns_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('sns_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('sns_token');
    }
  }, [token]);

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/me');
        setUser(data);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = (tokenVal, userData) => {
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
