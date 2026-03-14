import type { Set } from './set.interface';

export interface Card {
  id: string;
  image: string;
  localId: string;
  name: string;
  category?: string;
  illustrator?: string;
  rarity?: string;
  set?: Set;
  types?: string[];
  stage?: string;
}

// export interface CardVariant {}
