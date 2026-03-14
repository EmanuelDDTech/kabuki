import { shoriAPI } from '@/api/shoriAPI';
import type { Serie } from '../interfaces';

export const getSetsBySeriesIdAction = async (
  seriesId: string,
  // params: { page: number; itemsPerPage: number },
): Promise<Serie> => {
  try {
    const { data } = await shoriAPI.get<Serie>(`/cards/series/${seriesId}/sets`);
    return data;
  } catch (error) {
    throw new Error('No se pudieron obtener los sets de la serie');
  }
};
