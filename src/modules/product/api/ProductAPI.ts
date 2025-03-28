import api from '@/lib/axios';
import type { Product } from '../interfaces/product.interface';

export default {
  async create(data: Product) {
    return await api.post('/producto/products', data);
  },
  async getAll() {
    return await api.get('/producto/products');
  },
  async findById(id: any) {
    return await api.get(`/producto/products/${id}`);
  },
  async update(id: any, data: object) {
    return await api.put(`/producto/products/${id}`, data);
  },
  async delete(id: any) {
    return await api.delete(`/producto/products/${id}`);
  },
  async search(query: string, admin = false) {
    return await api.get(`/producto/buscar?q=${query}${admin ? '&admin=true' : ''}`);
  },
};
