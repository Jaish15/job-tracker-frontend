import axios from 'axios';

// Main AWS backend — handles login, register, jobs, all real data
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Render backend — only used for forgot password (email sending)
export const RENDER_API_URL = import.meta.env.VITE_RENDER_API_URL || 'https://job-tracker-backend-ie8b.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
