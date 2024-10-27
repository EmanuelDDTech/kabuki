export interface Category {
  id: number;
  name: string;
}

export interface FilterCategory {
  id: number;
  filter_group: FilterGroup[];
}

export interface FilterGroup {
  id: number;
  name: string;
  filter_values: FilterValue[];
}

export interface FilterValue {
  id: number;
  name: string;
}
