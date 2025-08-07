import api from '@/lib/axios';

export default {
  async getAll(query?: Record<string, string>) {
    return await api.get(`/users?${new URLSearchParams(query).toString()}`);
  },
  async getById(userId: number) {
    return await api.get(`/users/${userId}`);
  },
};
