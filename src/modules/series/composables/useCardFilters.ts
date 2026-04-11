import { computed, isRef, ref } from 'vue';
import type { Card } from '../interfaces';
import type { ComputedRef, Ref } from 'vue';

export type SortType = 'number' | 'price' | 'name';

export interface FilterState {
  sortBy: SortType;
  rarities: string[];
  types: string[];
}

export function useCardFilters(
  cardsInput: Ref<Card[] | undefined> | ComputedRef<Card[] | undefined> | Card[],
) {
  const filters = ref<FilterState>({
    sortBy: 'number',
    rarities: [],
    types: [],
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
      if (card.rarity) {
        raritiesSet.add(card.rarity);
      }
    });
    return Array.from(raritiesSet).sort();
  });

  const uniqueTypes = computed(() => {
    const typesSet = new Set<string>(['pokemon', 'item', 'tool', 'supported']);
    cards.value.forEach((card) => {
      card.types?.forEach((type) => {
        typesSet.add(type.toLowerCase());
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
      result = result.filter((card) => card.rarity && filters.value.rarities.includes(card.rarity));
    }

    // Apply type filter
    if (filters.value.types.length > 0) {
      result = result.filter((card) =>
        card.types?.some((type) => filters.value.types.includes(type)),
      );
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

  const setSortBy = (sort: SortType) => {
    filters.value.sortBy = sort;
  };

  const toggleRarity = (rarity: string) => {
    const index = filters.value.rarities.indexOf(rarity);
    if (index > -1) {
      filters.value.rarities.splice(index, 1);
    } else {
      filters.value.rarities.push(rarity);
    }
  };

  const toggleType = (type: string) => {
    const index = filters.value.types.indexOf(type);
    if (index > -1) {
      filters.value.types.splice(index, 1);
    } else {
      filters.value.types.push(type);
    }
  };

  const clearFilters = () => {
    filters.value.rarities = [];
    filters.value.types = [];
    filters.value.sortBy = 'number';
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
