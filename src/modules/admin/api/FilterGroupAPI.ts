import api from '@/lib/axios';

export default {
  async getAll() {
    const token = localStorage.getItem('AUTH_TOKEN');
    const { data } = await api.get('/filtro-grupo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  async getByCategoryId(id: number) {
    const token = localStorage.getItem('AUTH_TOKEN');
    const { data } = await api.get('/filtro-grupo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
