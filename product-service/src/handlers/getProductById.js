import * as productController from '../controllers/product';
import { getResponseObject, withLogger } from '../utils';

export const getProductById = async event => {
  try {
    const {
      pathParameters: { id },
    } = event;
    const productById = await productController.getProductById(id);

    if (!productById) {
      return getResponseObject(404, {
        error: `Product not found with id: ${id}`,
      });
    }

    return getResponseObject(200, { data: productById });
  } catch (e) {
    return getResponseObject(500, { error: 'Internal server error' });
  }
};

export default withLogger('getProductById')(getProductById);
