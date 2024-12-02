import api from '@/lib/axios';

export default {
  async create(data) {
    return await api.post('/product-gallery', data);
  },
  async findByProductId(productId) {
    return await api.get(`/product-gallery/${productId}`);
  },
  async updateGallery(id: any, data: object) {
    return await api.put(`/product-gallery/${id}`, data);
  },
};
