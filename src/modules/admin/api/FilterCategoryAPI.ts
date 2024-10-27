import api from '@/lib/axios';
import type { createFilterCategory } from '../interfaces/filterCategory.interface';

export default {
  async create(filter_group_id, product_category_id) {
    const token = localStorage.getItem('AUTH_TOKEN');
    return await api.post('/filtro-categoria', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      filter_group_id,
      product_category_id,
    });
  },

  async findAll(categId: number) {
    const token = localStorage.getItem('AUTH_TOKEN');
    const { data } = await api.get(`/filtro-categoria/${categId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  async delete(categId: number) {
    const token = localStorage.getItem('AUTH_TOKEN');
    const { data } = await api.delete(`/filtro-categoria/${categId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};
