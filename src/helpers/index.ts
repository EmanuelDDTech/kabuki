export const formatCurrency = (price: number) => {
  return Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};
