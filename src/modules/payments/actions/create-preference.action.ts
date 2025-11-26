import { shoriAPI } from '@/api/shoriAPI';
import type {
  CreatePreferenceResponse,
  ErrorResponse,
  Item,
  PreferenceMercadoPago,
  Urls,
} from '../interfaces';
import { isAxiosError } from 'axios';

export const createPreferenceAction = async ({
  items,
  notification_url,
  back_urls,
  auto_return = 'approved',
}: {
  items: Item[];
  notification_url: string;
  back_urls: Urls;
  auto_return?: string;
}): Promise<ErrorResponse | CreatePreferenceResponse> => {
  try {
    const { data } = await shoriAPI.post<PreferenceMercadoPago>('/mercadopago/create-preference', {
      items,
      notification_url,
      back_urls,
      auto_return,
    });

    return {
      ok: true,
      data: data.id,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return { ok: false };
    }

    throw new Error('No se pudo crear la preferencia de pago');
  }
};
