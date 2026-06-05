import api from '@/lib/axios';

export default {
  async findAvailable({
    zipCode,
    productsIds,
    userId,
  }: {
    zipCode: string;
    productsIds: number[];
    userId: number | undefined;
  }) {
    return await api.post(`/delivery/quote`, {
      zip_code: zipCode,
      products_ids: productsIds,
      user_id: userId,
    });
  },
};
