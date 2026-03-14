import type { Serie } from '../interfaces';
import { shoriAPI } from '@/api/shoriAPI';

export const getSeriesAction = async (params: {
  page: number;
  itemsPerPage: number;
}): Promise<Serie[]> => {
  try {
    const { data } = await shoriAPI.get<Serie[]>('/cards/series', { params });
    return data;
  } catch (error) {
    throw new Error('No se pudieron obtener las series');
  }
};
