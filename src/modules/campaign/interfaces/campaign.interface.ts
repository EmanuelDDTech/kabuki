import type { Product } from '@/modules/products/interfaces';

export interface Campaign {
  id: number;
  name: string;
  from: string;
  to: string;
  campaign_type: CampaignType;
  campaign_products: Product[];
}

export interface CampaignType {
  id: number;
  name: string;
}
