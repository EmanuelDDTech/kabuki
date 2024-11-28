import api from '@/lib/axios';

export default {
  async create(data: Object) {
    return await api.post('/filtro-categoria', data);
  },
  async findAll(categId: number) {
    return await api.get(`/filtro-categoria/${categId}`);
  },
  async delete(categId: number) {
    return await api.delete(`/filtro-categoria/${categId}`);
  },
};
