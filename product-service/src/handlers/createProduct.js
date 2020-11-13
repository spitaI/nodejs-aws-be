import * as productController from '../controllers/product';
import { getResponseObject, withLogger, validateProduct } from '../utils';

export const createProduct = async event => {
  try {
    const product = JSON.parse(event.body);

    const { error } = validateProduct(product);
    if (error) {
      return getResponseObject(400, { error: error.message });
    }

    const id = await productController.createProduct(product);
    return getResponseObject(200, { data: id });
  } catch (e) {
    return getResponseObject(500, { error: 'Internal server error' });
  }
};

export default withLogger('createProduct')(createProduct);
