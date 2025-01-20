export interface CreateAddress {
  city: string;
  colony: string;
  country: string;
  phone: string;
  state: string;
  street: string;
  zip: string;
}

export interface Address {
  id: number;
  street: string;
  colony: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
}
