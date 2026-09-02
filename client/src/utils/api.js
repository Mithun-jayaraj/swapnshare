import axios from 'axios';

// Create an axios instance that automatically adds the JWT token
const api = axios.create({
  baseURL: '/api',
});

// Before every request, attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
