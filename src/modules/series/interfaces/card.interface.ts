import type { Set } from './set.interface';

export interface CardAttack {
  cost?: string[];
  name: string;
  effect?: string;
  damage?: number;
}

export interface CardLegal {
  standard?: boolean;
  expanded?: boolean;
}

export interface CardVariantDetail {
  type: string;
  size?: string;
}

export interface CardmarketPricing {
  unit?: string;
  avg?: number;
  low?: number;
  trend?: number;
}

export interface CardPricing {
  cardmarket?: CardmarketPricing | null;
}

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
  hp?: number;
  attacks?: CardAttack[];
  retreat?: number;
  regulationMark?: string;
  legal?: CardLegal;
  updated?: string;
  pricing?: CardPricing;
  variants?: Record<string, boolean>;
  variants_detailed?: CardVariantDetail[];
}

// export interface CardVariant {}
