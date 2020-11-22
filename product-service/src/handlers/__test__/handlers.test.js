import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';

import { getProductsList } from '../getProductsList';
import { getProductById } from '../getProductById';
import { createProduct } from '../createProduct';
import { catalogBatchProcess } from '../catalogBatchProcess';
import {
  getProductsList as list,
  getProductById as getById,
  createProduct as create,
} from '../../controllers/product';
import { DEFAULT_HEADERS, SNS_PUBLICATION_SUBJECT } from '../../constants';
import { products } from '../__mock__';
import { getSNSPublicationMessage, getSNSArn } from '../../utils';

jest.mock('../../controllers/product');

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
      const mock = list.mockImplementation(() => Promise.resolve(products));
      const result = await getProductsList();
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({ data: products }),
        ...DEFAULT_HEADERS,
      });
      mock.mockClear();
    });

    it('should return error message when fails', async () => {
      const mock = list.mockImplementation(() => Promise.reject('Error'));
      const result = await getProductsList();
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        ...DEFAULT_HEADERS,
      });
      mock.mockClear();
    });
  });

  describe('getProductById handler tests', () => {
    it('should return a product by id', async () => {
      const mock = getById.mockImplementation(() =>
        Promise.resolve(products[0])
      );
      const id = products[0].id;
      const eventMock = getEventMock(id);
      const result = await getProductById(eventMock);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({ data: products[0] }),
        ...DEFAULT_HEADERS,
      });
      mock.mockClear();
    });

    it('should return 404 error when no product found', async () => {
      const mock = getById.mockImplementation(() => Promise.resolve(null));
      const id = 'non existing id';
      const eventMock = getEventMock(id);
      const result = await getProductById(eventMock);
      expect(result).toEqual({
        statusCode: 404,
        body: JSON.stringify({ error: `Product not found with id: ${id}` }),
        ...DEFAULT_HEADERS,
      });
      mock.mockClear();
    });

    it('should return error message when fails', async () => {
      const mock = getById.mockImplementation(() => Promise.reject('Error'));
      const id = products[0].id;
      const eventMock = getEventMock(id);
      const result = await getProductById(eventMock);
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        ...DEFAULT_HEADERS,
      });
      mock.mockClear();
    });
  });

  describe('createProduct handler tests', () => {
    it('should return a new product id', async () => {
      const mock = create.mockImplementation(() =>
        Promise.resolve(products[0].id)
      );
      const eventMock = getPostEventMock();
      const result = await createProduct(eventMock);
      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({ data: products[0].id }),
        ...DEFAULT_HEADERS,
      });
      mock.mockClear();
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
      const mock = create.mockImplementation(() => Promise.reject('Error'));
      const eventMock = getPostEventMock();
      const result = await createProduct(eventMock);
      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
        ...DEFAULT_HEADERS,
      });
      mock.mockClear();
    });
  });

  describe('catalogBatchProcess handler tests', () => {
    const getValidProducts = () =>
      products.slice(0, 2).map(({ id, ...rest }) => ({ ...rest }));
    const getInvalidProducts = () =>
      getValidProducts().map(p => ({
        ...p,
        count: 'invalid count',
      }));

    const getMockedEvent = products => ({
      Records: products.map(p => ({
        body: JSON.stringify(p),
      })),
    });

    let mockSnsPublish;

    beforeEach(() => {
      mockSnsPublish = jest.fn();
    });

    beforeAll(() => {
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock('SNS', 'publish', (params, cb) => {
        mockSnsPublish();
        cb(undefined, 'success');
      });
    });

    it('should save products to database and send notifications', async () => {
      const mock = create.mockImplementation(() => Promise.resolve(1));

      const eventMock = getMockedEvent(getValidProducts());
      await catalogBatchProcess(eventMock);

      expect(mock).toHaveBeenCalledTimes(2);
      expect(mock).toHaveBeenCalledWith(getValidProducts()[0]);
      expect(mock).toHaveBeenCalledWith(getValidProducts()[1]);
      expect(mockSnsPublish).toHaveBeenCalledTimes(2);
      mock.mockClear();
    });

    it('should ignore invalid products', async () => {
      const mock = create.mockImplementation(() => Promise.resolve(1));

      const eventMock = getMockedEvent(getInvalidProducts());
      await catalogBatchProcess(eventMock);

      expect(mock).toHaveBeenCalledTimes(0);
      expect(mockSnsPublish).toHaveBeenCalledTimes(0);
      mock.mockClear();
    });
  });
});
