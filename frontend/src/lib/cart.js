export const SHIPPING_FEE = 10;

export const getStockForSize = (product, size) => {
  const stockItem = product?.stock?.find((item) => item.size === size);
  return Number(stockItem?.quantity || 0);
};

export const isSizeInStock = (product, size) => getStockForSize(product, size) > 0;
