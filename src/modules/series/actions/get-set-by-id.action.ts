import { shoriAPI } from '@/api/shoriAPI';
import type { Set } from '../interfaces';

export const getSetByIdAction = async (setId: string): Promise<Set> => {
  try {
    const { data } = await shoriAPI.get<Set>(`/cards/sets/${setId}`);
    return data;
  } catch (error) {
    throw new Error('No se pudo obtener la información de la expansión');
  }
};
