import { shoriAPI } from '@/api/shoriAPI';
import type { Card } from '../interfaces';

export const getCardByIdAction = async (cardId: string): Promise<Card> => {
  try {
    const { data } = await shoriAPI.get<Card>(`/cards/card/${cardId}`);
    return data;
  } catch (error) {
    throw new Error('No se pudo obtener la carta');
  }
};
