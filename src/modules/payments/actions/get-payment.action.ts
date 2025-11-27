import { shoriAPI } from '@/api/shoriAPI';
import type { GetPaymentResponse } from '../interfaces/payment.mercadopago.response';
import type { ErrorResponse } from '../interfaces';
import { isAxiosError } from 'axios';

export const getPaymentAction = async ({
  payment_id,
}: {
  payment_id: string;
}): Promise<ErrorResponse | GetPaymentResponse> => {
  try {
    const { data } = await shoriAPI.get<GetPaymentResponse>(`/mercadopago/payment/${payment_id}`);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return { ok: false };
    }

    throw new Error('No se pudo obtener el pago');
  }
};
