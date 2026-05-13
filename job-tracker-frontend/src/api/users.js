import api from './axios';

export const usersApi = {
  getMe: () => api.get('/users/me'),
  getAll: () => api.get('/users'),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};
