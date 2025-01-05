import api from '@/lib/axios';

export default {
  async add(data: Object) {
    return await api.post('/carrito', data);
  },
  async get() {
    return await api.get('/carrito');
  },
  async update(data: Object) {
    return await api.put('/carrito', data);
  },
  async delete(data: Object) {
    return await api.delete(`/carrito/${data.productId}`);
  },
};
