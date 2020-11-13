import * as productController from '../controllers/product';
import { getResponseObject, withLogger } from '../utils';

export const getProductsList = async () => {
  try {
    const products = await productController.getProductsList();
    return getResponseObject(200, { data: products });
  } catch (e) {
    return getResponseObject(500, { error: 'Internal server error' });
  }
};

export default withLogger('getProductsList')(getProductsList);
