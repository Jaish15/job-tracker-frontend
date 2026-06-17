import api from './axios';

const isMockUser = () => {
  const token = localStorage.getItem('accessToken');
  return token && token.includes('mocksignature');
};

export const usersApi = {
  getMe: async () => {
    if (isMockUser()) {
      const user = localStorage.getItem('user');
      return { data: user ? JSON.parse(user) : null };
    }
    return api.get('/users/me');
  },
  getAll: async () => {
    if (isMockUser()) {
      return { data: [] };
    }
    return api.get('/users');
  },
  update: async (id, data) => {
    if (isMockUser()) {
      const user = localStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        const updated = { ...parsed, ...data };
        localStorage.setItem('user', JSON.stringify(updated));
        return { data: updated };
      }
    }
    return api.patch(`/users/${id}`, data);
  },
  delete: async (id) => {
    if (isMockUser()) {
      return { data: { success: true } };
    }
    return api.delete(`/users/${id}`);
  },
};
