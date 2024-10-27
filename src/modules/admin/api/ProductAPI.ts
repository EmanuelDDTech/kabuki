import api from '@/lib/axios';
import type { Product } from '../interfaces/product.interface';

export default {
  async create(productData: Product) {
    const token = localStorage.getItem('AUTH_TOKEN');
    return await api.post('/producto/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      name: productData.name,
      sku: productData.sku,
      description: productData.description,
      price: productData.price,
      image: productData.image,
      discount: productData.discount,
      stock: productData.stock,
      product_category_id: productData.product_category_id,
    });
  },
  async getAll() {
    const token = localStorage.getItem('AUTH_TOKEN');
    const { data } = await api.get('/producto/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};
