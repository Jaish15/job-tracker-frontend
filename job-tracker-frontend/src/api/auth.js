import axios from 'axios';
import api, { RENDER_API_URL } from './axios';

// Separate axios instance pointing to Render (only for email/reset)
const renderApi = axios.create({
  baseURL: RENDER_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const authApi = {
  // These go to AWS — real auth with real user data
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),

  // This goes to Render — sends the actual password reset email
  resetPassword: (data) => renderApi.post('/auth/reset-password', data),
};
