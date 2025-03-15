import api from '@/lib/axios';

export default {
  async create(data: Object) {
    return await api.post('/productos-destacados', data);
  },
  async getAll() {
    return await api.get('productos-destacados');
  },
  async delete(id: number) {
    return await api.delete(`productos-destacados/${id}`);
  },
  async update(id: number, newIndex: number) {
    return await api.put(`productos-destacados/${id}`, { newIndex });
  },
};
