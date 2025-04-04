import api from '@/lib/axios';

export default {
  async create(data: object) {
    return await api.post('/codigo-descuento/admin', data);
  },
  async getAll() {
    return await api.get('/codigo-descuento/admin');
  },
  async getById(id: number) {
    return await api.get(`/codigo-descuento/admin/${id}`);
  },
  async update(id: number, data: object) {
    return await api.put(`/codigo-descuento/admin/${id}`, data);
  },
  async delete(id: number) {
    return await api.delete(`/codigo-descuento/admin/${id}`);
  },
  async getByCode(code: string) {
    return await api.get(`/codigo-descuento/${code}`);
  },
  async updateTimesUsed(code: string) {
    return await api.put(`/codigo-descuento/${code}`);
  },
};
