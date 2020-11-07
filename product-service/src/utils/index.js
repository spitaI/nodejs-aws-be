import { products, DEFAULT_HEADERS } from '../constants';

export const getProducts = async () => Promise.resolve(products);

export const getResponseObject = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
  ...DEFAULT_HEADERS,
});
