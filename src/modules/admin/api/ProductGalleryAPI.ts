import api from '@/lib/axios';

export default {
  async create(data) {
    const token = localStorage.getItem('AUTH_TOKEN');
    return await api.post('/product-gallery', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
