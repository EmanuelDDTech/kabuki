import { computed, isRef } from 'vue';
import type { Card } from '../interfaces';
import type { ComputedRef, Ref } from 'vue';
import { useUrlFilters } from '@/composables/useUrlFilters';

export type SortType = 'number' | 'price' | 'name';

export interface FilterState {
  sortBy: SortType;
  rarities: string[];
  types: string[];
}

const INVALID_FILTER_VALUES = new Set(['', 'null', 'undefined', 'none', 'n/a', '-']);

const normalizeFilterLabel = (value: string) => value.trim();

const isValidFilterLabel = (value: string) => {
  const normalized = normalizeFilterLabel(value);
  if (normalized.length === 0) return false;
  return !INVALID_FILTER_VALUES.has(normalized.toLowerCase());
};

const parseArrayFilter = (raw: unknown, normalizeValue: (value: string) => string) => {
  const values = Array.isArray(raw)
    ? raw.filter((value): value is string => typeof value === 'string')
    : typeof raw === 'string'
      ? raw.split(',')
      : [];

  return Array.from(
    new Set(values.map(normalizeValue).filter((value) => isValidFilterLabel(value))),
  );
};

export function useCardFilters(
  cardsInput: Ref<Card[] | undefined> | ComputedRef<Card[] | undefined> | Card[],
) {
  const {
    state: filters,
    setFilter,
    toggleInArrayFilter,
    resetFilters,
    applyStateToUrl,
  } = useUrlFilters<FilterState>({
    sortBy: {
      default: 'number',
      parse: (raw) => {
        const value = Array.isArray(raw) ? raw[0] : raw;
        return value === 'number' || value === 'price' || value === 'name' ? value : 'number';
      },
    },
    rarities: {
      default: [],
      parse: (raw) => parseArrayFilter(raw, normalizeFilterLabel),
    },
    types: {
      default: [],
      parse: (raw) => parseArrayFilter(raw, (value) => normalizeFilterLabel(value).toLowerCase()),
    },
  });

  const cards = computed(() => {
    if (isRef(cardsInput)) {
      return cardsInput.value || [];
    }
    return Array.isArray(cardsInput) ? cardsInput : [];
  });

  // Extract unique rarities and types from cards
  const uniqueRarities = computed(() => {
    const raritiesSet = new Set<string>();
    cards.value.forEach((card) => {
      if (card.rarity && isValidFilterLabel(card.rarity)) {
        raritiesSet.add(normalizeFilterLabel(card.rarity));
      }
    });
    return Array.from(raritiesSet).sort();
  });

  const uniqueTypes = computed(() => {
    const typesSet = new Set<string>(['pokemon', 'item', 'tool', 'supporter']);
    cards.value.forEach((card) => {
      card.types?.forEach((type) => {
        const normalized = normalizeFilterLabel(type).toLowerCase();

        if (isValidFilterLabel(normalized)) {
          typesSet.add(normalized);
        }
      });
    });
    return Array.from(typesSet).sort();
  });

  const getCardPrice = (card: Card) => {
    const candidate = card as unknown as {
      price?: number | string;
      marketPrice?: number | string;
      lowestPrice?: number | string;
    };

    const rawPrice = candidate.price ?? candidate.marketPrice ?? candidate.lowestPrice ?? 0;
    const normalized = typeof rawPrice === 'string' ? Number(rawPrice) : rawPrice;

    return Number.isFinite(normalized) ? normalized : 0;
  };

  // Filter and sort cards
  const filteredCards = computed(() => {
    let result = [...cards.value];

    // Apply rarity filter
    if (filters.value.rarities.length > 0) {
      result = result.filter((card) => {
        if (!card.rarity) return false;
        return filters.value.rarities.includes(normalizeFilterLabel(card.rarity));
      });
    }

    // Apply type filter
    if (filters.value.types.length > 0) {
      result = result.filter((card) => {
        console.log(card);
        return card.types?.some((type) =>
          filters.value.types.includes(normalizeFilterLabel(type).toLowerCase()),
        );
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.value.sortBy) {
        case 'number':
          return (a.localId || '').localeCompare(b.localId || '');
        case 'price':
          return getCardPrice(a) - getCardPrice(b);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

    return result;
  });

  const setSortBy = async (sort: SortType) => {
    console.log('Applied sortBy filter:', sort);
    setFilter('sortBy', sort);
    await applyStateToUrl();
  };

  const toggleRarity = async (rarity: string) => {
    const normalized = normalizeFilterLabel(rarity);
    if (!isValidFilterLabel(normalized)) return;

    toggleInArrayFilter('rarities', normalized);
    await applyStateToUrl();
  };

  const toggleType = async (type: string) => {
    const normalized = normalizeFilterLabel(type).toLowerCase();
    if (!isValidFilterLabel(normalized)) return;

    toggleInArrayFilter('types', normalized);
    await applyStateToUrl();
  };

  const clearFilters = async () => {
    resetFilters();
    await applyStateToUrl();
  };

  const hasActiveFilters = computed(() => {
    return filters.value.rarities.length > 0 || filters.value.types.length > 0;
  });

  return {
    filters,
    filteredCards,
    uniqueRarities,
    uniqueTypes,
    setSortBy,
    toggleRarity,
    toggleType,
    clearFilters,
    hasActiveFilters,
  };
}
