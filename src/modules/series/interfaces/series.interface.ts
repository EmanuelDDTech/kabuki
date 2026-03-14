import type { Set } from './set.interface';

export interface Serie {
  id: string;
  name: string;
  logo?: string;
  firstSet?: Set;
  lastSet?: Set;
  releaseDate?: string;
  sets?: Set[];
}
