import type { ProductGroup } from './filter-group.interface';

export interface FilterCategory {
  id: number;
  filter_group: ProductGroup;
}
