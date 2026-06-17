import api from './axios';

export const authApi = {
  // These go to AWS — real auth with real user data
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  sendOtp:  (email) => api.post('/auth/send-otp', { email }),

  // Now goes to AWS as well — database-backed stateless reset token
  resetPassword: (data) => api.post('/auth/reset-password', data),
};
