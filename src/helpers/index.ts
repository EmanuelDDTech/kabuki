export const formatCurrency = (price: Number) => {
  return Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};
