import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSaleSummaryStore } from '@/modules/sale/stores/saleSummary';
import { Period } from '@/modules/cart/interfaces/sale.interface';

vi.mock('@/modules/cart/api/SaleAPI', () => ({
  default: {
    getByYear: vi.fn(),
    getByMonth: vi.fn(),
    getByWeek: vi.fn(),
    getByDay: vi.fn(),
    getAll: vi.fn(),
    getAllAdmin: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
}));

import SaleAPI from '@/modules/cart/api/SaleAPI';

const mockYearData = [
  { year: '2024', total: 5000 },
  { year: '2025', total: 7000 },
];

const mockMonthData = [
  { month: 'Enero', total: 1000 },
  { month: 'Febrero', total: 1500 },
];

const mockWeekData = [{ week: '2025-W01', total: 300 }];
const mockDayData = [{ day: '2025-01-01', total: 100 }];

describe('useSaleSummaryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty summary and default period options', () => {
    const store = useSaleSummaryStore();
    expect(store.saleSummary.data).toEqual([]);
    expect(store.saleSummary.labels).toEqual([]);
    expect(store.saleSummary.values).toEqual([]);
    expect(store.periodOptions).toContain(Period.MES);
    expect(store.selectedOption).toBe(Period.MES);
  });

  it('saleSummaryLabels returns empty array initially', () => {
    const store = useSaleSummaryStore();
    expect(store.saleSummaryLabels).toEqual([]);
  });

  it('saleSummaryValues returns empty array initially', () => {
    const store = useSaleSummaryStore();
    expect(store.saleSummaryValues).toEqual([]);
  });

  it('saleSummaryTotal returns 0 initially', () => {
    const store = useSaleSummaryStore();
    expect(store.saleSummaryTotal).toBe(0);
  });

  it('getSalesSummary fetches yearly data', async () => {
    vi.mocked(SaleAPI.getByYear).mockResolvedValueOnce({ data: mockYearData } as any);
    const store = useSaleSummaryStore();

    await store.getSalesSummary(Period.AÑO);

    expect(store.saleSummaryLabels).toEqual(['2024', '2025']);
    expect(store.saleSummaryValues).toEqual([5000, 7000]);
    expect(store.saleSummaryTotal).toBe(12000);
  });

  it('getSalesSummary fetches monthly data', async () => {
    vi.mocked(SaleAPI.getByMonth).mockResolvedValueOnce({ data: mockMonthData } as any);
    const store = useSaleSummaryStore();

    await store.getSalesSummary(Period.MES);

    expect(store.saleSummaryLabels).toEqual(['Enero', 'Febrero']);
    expect(store.saleSummaryValues).toEqual([1000, 1500]);
    expect(store.saleSummaryTotal).toBe(2500);
  });

  it('getSalesSummary fetches weekly data', async () => {
    vi.mocked(SaleAPI.getByWeek).mockResolvedValueOnce({ data: mockWeekData } as any);
    const store = useSaleSummaryStore();

    await store.getSalesSummary(Period.SEMANA);

    expect(store.saleSummaryLabels).toEqual(['2025-W01']);
    expect(store.saleSummaryValues).toEqual([300]);
  });

  it('getSalesSummary fetches daily data', async () => {
    vi.mocked(SaleAPI.getByDay).mockResolvedValueOnce({ data: mockDayData } as any);
    const store = useSaleSummaryStore();

    await store.getSalesSummary(Period.DIA);

    expect(store.saleSummaryLabels).toEqual(['2025-01-01']);
    expect(store.saleSummaryValues).toEqual([100]);
  });

  it('getSalesSummary sets loading to false after completion', async () => {
    vi.mocked(SaleAPI.getByMonth).mockResolvedValueOnce({ data: mockMonthData } as any);
    const store = useSaleSummaryStore();

    await store.getSalesSummary(Period.MES);

    expect(store.saleSummaryLabels).toHaveLength(2);
  });

  it('getSalesSummary throws error on API failure', async () => {
    vi.mocked(SaleAPI.getByMonth).mockRejectedValueOnce(new Error('Server error'));
    const store = useSaleSummaryStore();

    await expect(store.getSalesSummary(Period.MES)).rejects.toThrow('Server error');
  });

  it('selectPeriod updates selectedOption and fetches data', async () => {
    vi.mocked(SaleAPI.getByYear).mockResolvedValueOnce({ data: mockYearData } as any);
    const store = useSaleSummaryStore();

    await store.selectPeriod(Period.AÑO);

    expect(store.selectedOption).toBe(Period.AÑO);
    expect(SaleAPI.getByYear).toHaveBeenCalled();
  });

  it('selectPeriod throws on API failure', async () => {
    vi.mocked(SaleAPI.getByYear).mockRejectedValueOnce(new Error('Failed'));
    const store = useSaleSummaryStore();

    await expect(store.selectPeriod(Period.AÑO)).rejects.toThrow('Failed');
  });

  it('saleSummaryLabels returns a copy or labels', async () => {
    vi.mocked(SaleAPI.getByYear).mockResolvedValueOnce({ data: mockYearData } as any);
    const store = useSaleSummaryStore();
    await store.getSalesSummary(Period.AÑO);

    expect(store.saleSummaryLabels).toEqual(['2024', '2025']);
    expect(store.saleSummaryLabels).toHaveLength(2);
  });
});
