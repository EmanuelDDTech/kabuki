import api from '@/lib/axios';

export default {
  async create(name: string) {
    const token = localStorage.getItem('AUTH_TOKEN');
    return await api.post('/categoria', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      name,
    });
  },
  async getAll() {
    const token = localStorage.getItem('AUTH_TOKEN');
    const { data } = await api.get('/categoria', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  async delete(id: number) {
    return api.delete(`/categoria/${id}`);
  },

  async findOne(id: number) {
    const token = localStorage.getItem('AUTH_TOKEN');
    const { data } = await api.get(`/categoria/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  async update(id: number, name: string) {
    const token = localStorage.getItem('AUTH_TOKEN');
    return api.put(`/categoria/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      name,
    });
  },
};
