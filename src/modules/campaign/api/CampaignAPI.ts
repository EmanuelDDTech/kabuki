import api from '@/lib/axios';

export default {
  async create(data: object) {
    return await api.post('/campanas', data);
  },
  async getAll() {
    return await api.get('/campanas');
  },
  async getAllAdmin() {
    return await api.get('/campanas-admin');
  },
  async getById(id: number) {
    return await api.get(`/campanas/${id}`);
  },
  async update(id: number, data: object) {
    return await api.put(`/campanas/${id}`, data);
  },
  async delete(id: number) {
    return await api.delete(`/campanas/${id}`);
  },
};
