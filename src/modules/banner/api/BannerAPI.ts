import api from '@/lib/axios';

export default {
  async create(data: object) {
    return await api.post('/banner', data);
  },
};
