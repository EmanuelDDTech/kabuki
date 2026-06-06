import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import AddressAPI from '../api/AddressAPI';
import type { Address } from '../interfaces/address.interface';

export const useAddressStore = defineStore('address', () => {
  const selectedAddress = ref<Address | null>(null);
  const newAddress = ref({
    id: 0,
    country: '',
    street: '',
    colony: '',
    zip: '',
    city: '',
    state: '',
    phone: '',
    // saveInfo: false,
  });
  const savedAddresses = ref<Address[]>([]);
  const createNew = ref(false);

  const setCreateNew = (value: boolean) => {
    createNew.value = value;
  };

  const saveAddress = async () => {
    if (newAddress.value.id === 0) {
      const { data } = await AddressAPI.create(newAddress.value);
      savedAddresses.value.push(data);
    } else {
      await AddressAPI.update(newAddress.value);
      savedAddresses.value = savedAddresses.value.map((address) => {
        if (address.id === newAddress.value.id) {
          return newAddress.value;
        }
        return address;
      });
    }
  };

  const getAddresses = async () => {
    const { data } = await AddressAPI.getAll();
    savedAddresses.value = data;
  };

  const clearNewAddress = () => {
    newAddress.value = {
      id: 0,
      country: '',
      street: '',
      colony: '',
      zip: '',
      city: '',
      state: '',
      phone: '',
      // saveInfo: false,
    };
  };

  const selectAddress = (addressData: Address) => {
    selectedAddress.value = addressData;
  };

  const editAddress = (addressData: Address) => {
    newAddress.value = addressData;
    createNew.value = true;
  };

  const deleteAddress = async (id: number) => {
    await AddressAPI.delete(id);
    savedAddresses.value = savedAddresses.value.filter((address) => address.id !== id);
    clearNewAddress();
    selectedAddress.value = null;
  };

  const clearSelectedAddress = () => {
    selectedAddress.value = null;
  };

  return {
    selectedAddress,
    newAddress,
    createNew,
    savedAddresses,

    //Getters
    existSavedAddresses: computed(() => savedAddresses.value.length > 0),
    isSelected: computed(() => {
      return (id: number) => id === selectedAddress.value?.id;
    }),
    getSelectedAddress: computed(
      () => savedAddresses.value.filter((address) => address.id === selectedAddress.value?.id)[0],
    ),

    // Methods
    setCreateNew,
    saveAddress,
    getAddresses,
    clearNewAddress,
    selectAddress,
    editAddress,
    deleteAddress,
    clearSelectedAddress,
  };
});
