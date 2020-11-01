import { getProducts, getResponseObject } from '../utils';

export const getProductsList = async () => {
  try {
    const products = await getProducts();
    return getResponseObject(200, { data: products });
  } catch (e) {
    return getResponseObject(500, { error: 'Error getting product' });
  }
};
