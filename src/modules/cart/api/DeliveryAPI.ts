import api from '@/lib/axios';

export default {
  async findAvailable(weight: number, zipCode: number) {
    return await api.get(`/delivery?weight=${weight}&zipCode=${zipCode}`);
  },
};
