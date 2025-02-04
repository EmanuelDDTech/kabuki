export interface Campaign {
  id: number;
  name: string;
  from: string;
  to: string;
  campaign_type: CampaignType;
}

export interface CampaignType {
  id: number;
  name: string;
}
