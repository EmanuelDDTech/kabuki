import api from '@/lib/axios';
import type { Address, CreateAddress } from '../interfaces/address.interface';

export default {
  async create(data: CreateAddress) {
    return await api.post('/address', data);
  },
  async getAll() {
    return await api.get('/address');
  },
  async getOne(id: number): Promise<Address> {
    return await api.get(`/address/${id}`);
  },
  async update(data: Address) {
    return await api.put(`/address/${data.id}`, data);
  },
  async delete(id: number) {
    return await api.delete(`/address/${id}`);
  },
};
