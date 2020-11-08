import { getProductsList } from '../getProductsList';
import { getProductById } from '../getProductById';
import { createProduct } from '../createProduct';
import { DEFAULT_HEADERS } from '../../constants';
import { products } from '../__mock__';
import * as productController from '../../controllers/product';

describe('AWS Lambda handlers tests', () => {
  const getEventMock = id => ({
    pathParameters: { id },
  });
  const getPostEventMock = (obj = {}) => {
    const product = {
      ...products[0],
      count: 1,
      ...obj,
    };
    delete product.id;
    return { body: JSON.stringify(product) };
  };

  describe('getProductsList handler tests', () => {
    it('should return correct response', async () => {
      jest
        .spyOn(productController, 'getProductsList')
        .mockImplementationOnce(() => Promise.resolve(products));
      const result = await getProductsList();
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({ data: products }),
        ...DEFAULT_HEADERS,
      });
    });

    it('should return error message when fails', async () => {
      jest
        .spyOn(productController, 'getProductsList')
        .mockImplementationOnce(() => Promise.reject('Error'));
      const result = await getProductsList();
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        ...DEFAULT_HEADERS,
      });
    });
  });

  describe('getProductById handler tests', () => {
    it('should return a product by id', async () => {
      jest
        .spyOn(productController, 'getProductById')
        .mockImplementationOnce(() => Promise.resolve(products[0]));
      const id = products[0].id;
      const eventMock = getEventMock(id);
      const result = await getProductById(eventMock);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({ data: products[0] }),
        ...DEFAULT_HEADERS,
      });
    });

    it('should return 404 error when no product found', async () => {
      jest
        .spyOn(productController, 'getProductById')
        .mockImplementationOnce(() => Promise.resolve(null));
      const id = 'non existing id';
      const eventMock = getEventMock(id);
      const result = await getProductById(eventMock);
      expect(result).toEqual({
        statusCode: 404,
        body: JSON.stringify({ error: `Product not found with id: ${id}` }),
        ...DEFAULT_HEADERS,
      });
    });

    it('should return error message when fails', async () => {
      jest;
      jest
        .spyOn(productController, 'getProductById')
        .mockImplementationOnce(() => Promise.reject('Error'));
      const id = products[0].id;
      const eventMock = getEventMock(id);
      const result = await getProductById(eventMock);
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        ...DEFAULT_HEADERS,
      });
    });
  });

  describe('createProduct handler tests', () => {
    it('should return a new product id', async () => {
      jest
        .spyOn(productController, 'createProduct')
        .mockImplementationOnce(() => Promise.resolve(products[0].id));
      const eventMock = getPostEventMock();
      const result = await createProduct(eventMock);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({ data: products[0].id }),
        ...DEFAULT_HEADERS,
      });
    });

    it('should return 400 error when data is invalid', async () => {
      const eventMock = getPostEventMock({ title: '' });
      const result = await createProduct(eventMock);
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({ error: 'A title should be provided' }),
        ...DEFAULT_HEADERS,
      });
    });

    it('should return error message when fails', async () => {
      jest
        .spyOn(productController, 'createProduct')
        .mockImplementationOnce(() => Promise.reject('Error'));
      const eventMock = getPostEventMock();
      const result = await createProduct(eventMock);
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        ...DEFAULT_HEADERS,
      });
    });
  });
});
