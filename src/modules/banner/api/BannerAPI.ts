import api from '@/lib/axios';

export default {
  async create(data: object) {
    return await api.post('/banner', data);
  },
  async getAll() {
    return await api.get('/banner');
  },
  async getById(id: number) {
    return await api.get(`/banner/${id}`);
  },
  async update(id: number, data: object) {
    return await api.put(`/banner/${id}`, data);
  },
  async delete(id: number) {
    return await api.delete(`/banner/${id}`);
  },
};
