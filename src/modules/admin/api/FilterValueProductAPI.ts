import api from '@/lib/axios';

export default {
  async save(data: Object) {
    return await api.post('/filtro-producto', data);
  },
  async findByProductId(productId: any) {
    return await api.get(`/filtro-producto/${productId}`);
  },
};
