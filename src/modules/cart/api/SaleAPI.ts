import api from '@/lib/axios';

export default {
  async create(data: Object) {
    return await api.post('/ordenes', data);
  },
  async getAll() {
    return await api.get('/ordenes');
  },
  async getAllAdmin(query?: Record<string, string>) {
    return await api.get(`/ordenes/admin?${new URLSearchParams(query).toString()}`);
  },
  async getById(id: number) {
    return await api.get(`/ordenes/${id}`);
  },
  async update(id: number, data: Object) {
    return await api.put(`/ordenes/${id}`, data);
  },
  async getByYear() {
    return await api.get('/ordenes/admin/byYear');
  },
  async getByMonth() {
    return await api.get('/ordenes/admin/byMonth');
  },
  async getByWeek() {
    return await api.get('/ordenes/admin/byWeek');
  },
  async getByDay() {
    return await api.get('/ordenes/admin/byDay');
  },
};
