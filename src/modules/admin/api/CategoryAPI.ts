import api from '@/lib/axios';

export default {
  async create(data) {
    const token = localStorage.getItem('AUTH_TOKEN');
    return await api.post('/categoria', data);
  },
  async getAll() {
    return await api.get('/categoria');
  },
  async delete(id: number) {
    return await api.delete(`/categoria/${id}`);
  },
  async findOne(id: number) {
    return await api.get(`/categoria/${id}`);
  },
  async update(id: Number, data: Object) {
    return await api.put(`/categoria/${id}`, data);
  },
};
