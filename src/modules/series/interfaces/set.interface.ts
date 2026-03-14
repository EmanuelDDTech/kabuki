export interface Set {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  cartCount: CardCount;
}

export interface CardCount {
  official: number;
  total: number;
}
