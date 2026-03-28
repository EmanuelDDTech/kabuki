import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/', params: {}, query: {} }),
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    inject: vi.fn().mockReturnValue({ open: vi.fn() }),
    onMounted: vi.fn(),
  };
});

vi.mock('@/modules/campaign/api/CampaignAPI', () => ({
  default: {
    getAll: vi.fn(),
    getAllAdmin: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
  },
}));

vi.mock('@/modules/campaign/api/CampaignProductAPI', () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getByCampaignId: vi.fn(),
    deleteByCampaignId: vi.fn(),
  },
}));

import CampaignAPI from '@/modules/campaign/api/CampaignAPI';
import CampaignProductAPI from '@/modules/campaign/api/CampaignProductAPI';
import { useCampaignStore } from '@/modules/campaign/stores/campaign';

const mockCampaign = {
  id: 1,
  name: 'Flash Sale',
  from: '2025-01-01T00:00:00.000Z',
  to: '2025-01-31T23:59:59.000Z',
  campaign_type_id: 1,
};

const mockProduct = {
  id: 10,
  name: 'Rare Card',
  price: 150,
  active: true,
  discount: 0,
  stock_visible: true,
  product_galleries: [],
};

describe('useCampaignStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty state', () => {
    const store = useCampaignStore();
    expect(store.campaigns).toEqual([]);
    expect(store.campaign.name).toBe('');
    expect(store.campaign.id).toBeNull();
    expect(store.campaignProducts).toEqual([]);
  });

  it('getCampaignsAll fetches and stores campaigns', async () => {
    vi.mocked(CampaignAPI.getAll).mockResolvedValueOnce({ data: [mockCampaign] } as any);
    const store = useCampaignStore();

    await store.getCampaignsAll();

    expect(CampaignAPI.getAll).toHaveBeenCalled();
    expect(store.campaigns).toEqual([mockCampaign]);
  });

  it('getCampaignsAllAdmin fetches admin campaigns', async () => {
    vi.mocked(CampaignAPI.getAllAdmin).mockResolvedValueOnce({ data: [mockCampaign] } as any);
    const store = useCampaignStore();

    await store.getCampaignsAllAdmin();

    expect(CampaignAPI.getAllAdmin).toHaveBeenCalled();
    expect(store.campaigns).toEqual([mockCampaign]);
  });

  it('addProduct adds product to campaignProducts when no active campaign', async () => {
    const store = useCampaignStore();

    await store.addProduct(mockProduct as any);

    expect(store.campaignProducts).toHaveLength(1);
    expect(store.campaignProducts[0].product).toEqual(mockProduct);
    expect(store.campaignProducts[0].campaign_price).toBe(mockProduct.price);
  });

  it('addProduct does not add duplicate products', async () => {
    const store = useCampaignStore();

    await store.addProduct(mockProduct as any);
    await store.addProduct(mockProduct as any);

    expect(store.campaignProducts).toHaveLength(1);
  });

  it('addProduct adds product with API call when campaign is active', async () => {
    const mockCampaignProduct = {
      id: 5,
      campaign_price: 120,
      campaign_id: 1,
    };
    vi.mocked(CampaignProductAPI.create).mockResolvedValueOnce({
      data: mockCampaignProduct,
    } as any);
    const store = useCampaignStore();
    store.campaign.id = 1;

    await store.addProduct(mockProduct as any);

    expect(CampaignProductAPI.create).toHaveBeenCalledWith({
      campaign_id: 1,
      product_id: mockProduct.id,
      campaign_price: mockProduct.price,
    });
    expect(store.campaignProducts).toHaveLength(1);
  });

  it('editProductPrice updates campaign product price', async () => {
    const store = useCampaignStore();
    store.campaignProducts = [
      { id: null, campaign_price: 150, campaign_id: null, product: mockProduct as any },
    ];

    await store.editProductPrice(100, mockProduct.id);

    expect(store.campaignProducts[0].campaign_price).toBe(100);
  });

  it('deleteProduct removes product from campaignProducts without API when no active campaign', async () => {
    const store = useCampaignStore();
    store.campaignProducts = [
      { id: null, campaign_price: 150, campaign_id: null, product: mockProduct as any },
    ];

    await store.deleteProduct({ product: mockProduct });

    expect(store.campaignProducts).toHaveLength(0);
  });

  it('cleanCampaign resets campaign and campaignProducts', () => {
    const store = useCampaignStore();
    store.campaign.name = 'Test';
    store.campaignProducts = [
      { id: null, campaign_price: 150, campaign_id: null, product: mockProduct as any },
    ];

    store.cleanCampaign();

    expect(store.campaign.name).toBe('');
    expect(store.campaignProducts).toEqual([]);
    expect(store.campaign.id).toBeNull();
  });
});
