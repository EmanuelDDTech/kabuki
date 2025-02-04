import api from '@/lib/axios';

export default {
  async create(data: object) {
    return await api.post('/campanas-productos', data);
  },
  async getByCampaignId(id: number) {
    return await api.get(`/campanas-productos/campaign/${id}`);
  },
  async getAll() {
    return await api.get('/campanas-productos');
  },
  async update(id: number, data: object) {
    return await api.put(`/campanas-productos/${id}`, data);
  },
  async delete(id: number) {
    return await api.delete(`/campanas-productos/${id}`);
  },
};
