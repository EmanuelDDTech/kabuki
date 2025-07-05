import api from '@/lib/axios';

export default {
  async getAll() {
    return await api.get('/users');
  },
  async getById(userId: number) {
    return await api.get(`/users/${userId}`);
  },
};
