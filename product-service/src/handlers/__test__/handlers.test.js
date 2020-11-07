import { getProductsList } from '../getProductsList';
import { getProductById } from '../getProductById';
import { products, DEFAULT_HEADERS } from '../../constants';
import * as utils from '../../utils';

describe('AWS Lambda handlers tests', () => {
  const getEventMock = id => ({
    pathParameters: { id },
  });

  describe('getProductsList handler tests', () => {
    it('should return correct response', async () => {
      const result = await getProductsList();
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({ data: products }),
        ...DEFAULT_HEADERS,
      });
    });

    it('should return error message when fails', async () => {
      jest
        .spyOn(utils, 'getProducts')
        .mockImplementationOnce(() => Promise.reject('Error'));
      const result = await getProductsList();
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Error getting product' }),
        ...DEFAULT_HEADERS,
      });
    });
  });

  describe('getProductById handler tests', () => {
    it('should return a product by id', async () => {
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
      jest
        .spyOn(utils, 'getProducts')
        .mockImplementationOnce(() => Promise.reject('Error'));
      const id = products[0].id;
      const eventMock = getEventMock(id);
      const result = await getProductById(eventMock);
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Error getting product' }),
        ...DEFAULT_HEADERS,
      });
    });
  });
});
