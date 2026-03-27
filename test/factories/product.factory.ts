interface ProductFactoryParams {
  id?: number;
  name?: string;
  price?: number;
  stock?: number;
  discount?: number;
  weight?: number;
}

export const buildProduct = (params: ProductFactoryParams = {}) => ({
  id: params.id ?? 1,
  name: params.name ?? 'Product Test',
  price: params.price ?? 100,
  stock: params.stock ?? 10,
  discount: params.discount ?? 0,
  stock_visible: true,
  weight: params.weight ?? 0.1,
  active: true,
  product_galleries: [],
});
