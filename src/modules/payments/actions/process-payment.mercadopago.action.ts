import { shoriAPI } from '@/api/shoriAPI';
import { isAxiosError } from 'axios';

export const processPaymentAction = async (payment_id: string): Promise<Boolean> => {
  try {
    const { data } = await shoriAPI.post<Boolean>('/mercadopago/process/payment', {
      payment_id,
    });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return false;
    }

    throw new Error('No se pudo procesar el pago');
  }
};
