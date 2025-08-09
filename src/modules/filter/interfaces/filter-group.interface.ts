import type { FilterValue } from './filter-value.interface';

export interface ProductGroup {
  id: number;
  name: string;
  slug: string;
  filter_values: FilterValue[];
}
