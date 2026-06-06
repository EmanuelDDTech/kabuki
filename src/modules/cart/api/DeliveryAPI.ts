import api from '@/lib/axios';
import type { DeliveryCarrierType } from '../interfaces/delivery.interface';

export default {
  async findAvailable({
    zipCode,
    productsIds,
    userId,
    deliveryType,
  }: {
    zipCode: string;
    productsIds: number[];
    userId: number | undefined;
    deliveryType: DeliveryCarrierType;
  }) {
    return await api.post(`/delivery/quote`, {
      zipCode: zipCode,
      productsIds: productsIds,
      userId: userId,
      type: deliveryType,
    });
  },
};
