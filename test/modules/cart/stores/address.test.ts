import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAddressStore } from '@/modules/cart/stores/address';
import type { Address } from '@/modules/cart/interfaces/address.interface';

vi.mock('@/modules/cart/api/AddressAPI', () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

import AddressAPI from '@/modules/cart/api/AddressAPI';

const mockAddress: Address = {
  id: 1,
  country: 'Mexico',
  street: 'Calle Falsa 123',
  colony: 'Centro',
  zip: '01000',
  city: 'CDMX',
  state: 'CDMX',
  phone: '5551234567',
};

describe('useAddressStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const store = useAddressStore();
    expect(store.selectedAddress).toBe(0);
    expect(store.savedAddresses).toEqual([]);
    expect(store.createNew).toBe(false);
    expect(store.existSavedAddresses).toBe(false);
  });

  it('newAddress initializes with empty values', () => {
    const store = useAddressStore();
    expect(store.newAddress.id).toBe(0);
    expect(store.newAddress.country).toBe('');
    expect(store.newAddress.street).toBe('');
  });

  it('setCreateNew updates createNew flag', () => {
    const store = useAddressStore();
    store.setCreateNew(true);
    expect(store.createNew).toBe(true);
    store.setCreateNew(false);
    expect(store.createNew).toBe(false);
  });

  it('selectAddress sets selectedAddress id', () => {
    const store = useAddressStore();
    store.selectAddress(5);
    expect(store.selectedAddress).toBe(5);
  });

  it('isSelected returns true for selected address', () => {
    const store = useAddressStore();
    store.selectAddress(3);
    expect(store.isSelected(3)).toBe(true);
    expect(store.isSelected(2)).toBe(false);
  });

  it('clearSelectedAddress resets to 0', () => {
    const store = useAddressStore();
    store.selectAddress(5);
    store.clearSelectedAddress();
    expect(store.selectedAddress).toBe(0);
  });

  it('clearNewAddress resets newAddress to defaults', () => {
    const store = useAddressStore();
    store.newAddress.street = 'Test Street';
    store.newAddress.city = 'Test City';

    store.clearNewAddress();

    expect(store.newAddress.street).toBe('');
    expect(store.newAddress.city).toBe('');
    expect(store.newAddress.id).toBe(0);
  });

  it('editAddress sets newAddress and createNew to true', () => {
    const store = useAddressStore();
    store.editAddress(mockAddress);

    expect(store.newAddress).toEqual(mockAddress);
    expect(store.createNew).toBe(true);
  });

  it('getAddresses fetches and stores addresses', async () => {
    vi.mocked(AddressAPI.getAll).mockResolvedValueOnce({ data: [mockAddress] } as any);
    const store = useAddressStore();

    await store.getAddresses();

    expect(store.savedAddresses).toEqual([mockAddress]);
    expect(store.existSavedAddresses).toBe(true);
  });

  it('saveAddress creates new address when id is 0', async () => {
    vi.mocked(AddressAPI.create).mockResolvedValueOnce({ data: mockAddress } as any);
    const store = useAddressStore();

    await store.saveAddress();

    expect(AddressAPI.create).toHaveBeenCalledWith(store.newAddress);
    expect(store.savedAddresses).toContainEqual(mockAddress);
  });

  it('saveAddress updates existing address when id is not 0', async () => {
    vi.mocked(AddressAPI.update).mockResolvedValueOnce({} as any);
    const store = useAddressStore();
    store.newAddress.id = 1;
    store.savedAddresses = [mockAddress];

    await store.saveAddress();

    expect(AddressAPI.update).toHaveBeenCalledWith(store.newAddress);
  });

  it('saveAddress updates the correct address in savedAddresses', async () => {
    const updatedAddress = { ...mockAddress, street: 'Nueva Calle 456' };
    vi.mocked(AddressAPI.update).mockResolvedValueOnce({} as any);
    const store = useAddressStore();
    store.savedAddresses = [mockAddress];
    store.newAddress = { ...updatedAddress };

    await store.saveAddress();

    expect(store.savedAddresses[0].street).toBe('Nueva Calle 456');
  });

  it('deleteAddress removes address from savedAddresses and calls API', async () => {
    vi.mocked(AddressAPI.delete).mockResolvedValueOnce({} as any);
    const store = useAddressStore();
    store.savedAddresses = [mockAddress];
    store.selectAddress(1);

    await store.deleteAddress(1);

    expect(AddressAPI.delete).toHaveBeenCalledWith(1);
    expect(store.savedAddresses).toHaveLength(0);
    expect(store.selectedAddress).toBe(0);
  });

  it('getSelectedAddress returns the selected address', () => {
    const store = useAddressStore();
    store.savedAddresses = [mockAddress];
    store.selectAddress(1);

    expect(store.getSelectedAddress).toEqual(mockAddress);
  });

  it('getSelectedAddress returns undefined when none selected', () => {
    const store = useAddressStore();
    store.savedAddresses = [mockAddress];

    expect(store.getSelectedAddress).toBeUndefined();
  });
});
