import { getProducts, getResponseObject } from '../utils';

export const getProductById = async event => {
  try {
    const {
      pathParameters: { id },
    } = event;
    const products = await getProducts();
    const productById = products.find(p => p.id === id);

    if (!productById) {
      return getResponseObject(404, {
        error: `Product not found with id: ${id}`,
      });
    }

    return getResponseObject(200, { data: productById });
  } catch (e) {
    return getResponseObject(500, { error: 'Error getting product' });
  }
};
