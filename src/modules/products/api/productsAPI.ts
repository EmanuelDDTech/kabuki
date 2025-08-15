import api from '@/lib/axios';

export default {
  async findProducts(query: string) {
    return await api.get(`/productos?${query}`);
  },
  async findProductsAdmin(query: string) {
    return await api.get(`/productos/admin?${query}`);
  },
};
