import type { Card } from './card.interface';
import type { Serie } from './series.interface';

export interface Set {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  cartCount: CardCount;
  legal?: Legal;
  releaseDate?: string;
  serie?: Serie;
  abbreviation?: Abbreviation;
  cards?: Card[];
}

export interface CardCount {
  official: number;
  total: number;
}

export interface Legal {
  expanded: boolean;
  standard: boolean;
}

export interface Abbreviation {
  official: string;
}
