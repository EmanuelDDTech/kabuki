import { computed, ref, watch } from 'vue';
import {
  useRoute,
  useRouter,
  type LocationQuery,
  type LocationQueryRaw,
  type LocationQueryValue,
} from 'vue-router';

type Primitive = string | number | boolean;
type ArrayItemType = 'string' | 'number';
type SyncMode = 'push' | 'replace';

export interface UrlFilterField<TValue> {
  default: TValue;
  key?: string;
  parse?: (raw: LocationQueryValue | LocationQueryValue[] | undefined) => TValue;
  serialize?: (value: TValue) => LocationQueryValue | LocationQueryValue[] | undefined;
  equals?: (left: TValue, right: TValue) => boolean;
  arraySeparator?: string;
  arrayItemType?: ArrayItemType;
}

export type UrlFilterSchema<TState extends object> = {
  [K in keyof TState]: UrlFilterField<TState[K]>;
};

export interface UseUrlFiltersOptions {
  syncMode?: SyncMode;
  keepUnknownQueryParams?: boolean;
  omitDefaultsFromUrl?: boolean;
}

interface InternalUseUrlFiltersOptions extends UseUrlFiltersOptions {
  syncMode: SyncMode;
  keepUnknownQueryParams: boolean;
  omitDefaultsFromUrl: boolean;
}

const defaultOptions: InternalUseUrlFiltersOptions = {
  syncMode: 'replace',
  keepUnknownQueryParams: true,
  omitDefaultsFromUrl: true,
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const cloneValue = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return [...value] as T;
  }

  if (isPlainObject(value)) {
    return { ...value } as T;
  }

  return value;
};

const valuesEqual = (left: unknown, right: unknown): boolean => {
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false;
    return left.every((item, index) => valuesEqual(item, right[index]));
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) return false;

    return leftKeys.every((key) => valuesEqual(left[key], right[key]));
  }

  return left === right;
};

const toQueryArray = (
  raw: LocationQueryValue | LocationQueryValue[] | undefined,
  separator: string,
) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return raw.split(separator).filter(Boolean);
  return [];
};

const parseNumber = (raw: LocationQueryValue | undefined, fallback: number): number => {
  if (typeof raw !== 'string') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (raw: LocationQueryValue | undefined, fallback: boolean): boolean => {
  if (typeof raw !== 'string') return fallback;
  if (raw === '1' || raw.toLowerCase() === 'true') return true;
  if (raw === '0' || raw.toLowerCase() === 'false') return false;
  return fallback;
};

const serializeArray = (
  values: unknown[],
  itemType: ArrayItemType,
  separator: string,
): LocationQueryValue[] | LocationQueryValue | undefined => {
  if (values.length === 0) return undefined;

  const normalized =
    itemType === 'number'
      ? values.map((value) => String(Number(value))).filter((value) => value !== 'NaN')
      : values.map((value) => String(value));

  if (normalized.length === 0) return undefined;

  return normalized.includes(separator) ? normalized.join(separator) : normalized;
};

export function useUrlFilters<TState extends object>(
  schema: UrlFilterSchema<TState>,
  options: UseUrlFiltersOptions = {},
) {
  const route = useRoute();
  const router = useRouter();

  const resolvedOptions: InternalUseUrlFiltersOptions = {
    ...defaultOptions,
    ...options,
  };

  const keys = Object.keys(schema) as (keyof TState)[];

  const defaults = computed(() => {
    const next = {} as TState;

    keys.forEach((key) => {
      next[key] = cloneValue(schema[key].default);
    });

    return next;
  });

  const parseField = <K extends keyof TState>(
    key: K,
    query: LocationQuery,
    fallbackState: TState,
  ): TState[K] => {
    const field = schema[key];
    const queryKey = field.key ?? String(key);
    const raw = query[queryKey];

    if (field.parse) {
      return field.parse(raw);
    }

    const fallbackValue = fallbackState[key];
    const arraySeparator = field.arraySeparator ?? ',';

    if (Array.isArray(fallbackValue)) {
      const itemType = field.arrayItemType ?? 'string';
      const values = toQueryArray(raw, arraySeparator);

      if (itemType === 'number') {
        return values
          .map((value) => Number(value))
          .filter((value) => Number.isFinite(value)) as TState[K];
      }

      return values.map((value) => String(value)) as TState[K];
    }

    if (typeof fallbackValue === 'number') {
      return parseNumber(Array.isArray(raw) ? raw[0] : raw, fallbackValue) as TState[K];
    }

    if (typeof fallbackValue === 'boolean') {
      return parseBoolean(Array.isArray(raw) ? raw[0] : raw, fallbackValue) as TState[K];
    }

    if (typeof fallbackValue === 'string') {
      const value = Array.isArray(raw) ? raw[0] : raw;
      return (typeof value === 'string' ? value : fallbackValue) as TState[K];
    }

    return cloneValue(fallbackValue);
  };

  const parseQueryToState = (query: LocationQuery): TState => {
    const base = defaults.value;
    const next = {} as TState;

    keys.forEach((key) => {
      next[key] = parseField(key, query, base);
    });

    return next;
  };

  const serializeField = <K extends keyof TState>(key: K, value: TState[K]) => {
    const field = schema[key];

    if (field.serialize) {
      return field.serialize(value);
    }

    const arraySeparator = field.arraySeparator ?? ',';

    if (Array.isArray(value)) {
      return serializeArray(value, field.arrayItemType ?? 'string', arraySeparator);
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : undefined;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? String(value) : undefined;
    }

    if (typeof value === 'string') {
      return value.length > 0 ? value : undefined;
    }

    return undefined;
  };

  const buildQueryFromState = (currentState: TState): LocationQueryRaw => {
    const query: LocationQueryRaw = resolvedOptions.keepUnknownQueryParams
      ? { ...route.query }
      : {};

    keys.forEach((key) => {
      const field = schema[key];
      const queryKey = field.key ?? String(key);
      const defaultValue = defaults.value[key];
      const currentValue = currentState[key];
      const equals = field.equals ?? valuesEqual;

      if (resolvedOptions.omitDefaultsFromUrl && equals(currentValue, defaultValue)) {
        delete query[queryKey];
        return;
      }

      const serialized = serializeField(key, currentValue);

      if (serialized === undefined) {
        delete query[queryKey];
        return;
      }

      query[queryKey] = serialized;
    });

    return query;
  };

  const state = ref<TState>(parseQueryToState(route.query));
  const syncFromRoute = ref(false);
  const syncFromState = ref(false);

  const applyStateToUrl = async () => {
    const query = buildQueryFromState(state.value);

    if (resolvedOptions.syncMode === 'push') {
      await router.push({ query });
      return;
    }

    await router.replace({ query });
  };

  watch(
    () => route.query,
    (query) => {
      if (syncFromState.value) return;
      syncFromRoute.value = true;
      state.value = parseQueryToState(query);
      syncFromRoute.value = false;
    },
  );

  watch(
    state,
    async () => {
      if (syncFromRoute.value) return;
      syncFromState.value = true;
      await applyStateToUrl();
      syncFromState.value = false;
    },
    { deep: true },
  );

  const setFilter = <K extends keyof TState>(key: K, value: TState[K]) => {
    state.value[key] = value;
  };

  const patchFilters = (patch: Partial<TState>) => {
    state.value = {
      ...state.value,
      ...patch,
    };
  };

  const resetFilters = (keysToReset?: (keyof TState)[]) => {
    if (!keysToReset || keysToReset.length === 0) {
      state.value = defaults.value;
      return;
    }

    const next = { ...state.value };

    keysToReset.forEach((key) => {
      next[key] = cloneValue(defaults.value[key]);
    });

    state.value = next;
  };

  const toggleInArrayFilter = <K extends keyof TState>(key: K, value: Primitive) => {
    const current = state.value[key];

    if (!Array.isArray(current)) return;

    const normalized = [...current] as Primitive[];
    const index = normalized.findIndex((item) => item === value);

    if (index >= 0) {
      normalized.splice(index, 1);
    } else {
      normalized.push(value);
    }

    setFilter(key, normalized as TState[K]);
  };

  const activeKeys = computed(() => {
    return keys.filter((key) => {
      const field = schema[key];
      const equals = field.equals ?? valuesEqual;
      return !equals(state.value[key], defaults.value[key]);
    });
  });

  const hasActiveFilters = computed(() => activeKeys.value.length > 0);

  const activeFiltersCount = computed(() => activeKeys.value.length);

  return {
    state,
    defaults,
    activeKeys,
    hasActiveFilters,
    activeFiltersCount,
    setFilter,
    patchFilters,
    resetFilters,
    toggleInArrayFilter,
    applyStateToUrl,
  };
}
