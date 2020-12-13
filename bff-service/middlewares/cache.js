import { response } from 'express';
import NodeCache from 'node-cache';

import { shouldUseCache } from '../utils';

const cache = new NodeCache();

export const cachedResponseMiddleware = (req, res, next) => {
  const { originalUrl, method } = req;
  if (!shouldUseCache(originalUrl, method)) return next();

  const cachedResponse = cache.get(`${method}:${originalUrl}`);
  if (!cachedResponse) return next();

  return res
    .set(cachedResponse.headers)
    .status(cachedResponse.status)
    .json(cachedResponse.data);
};

export const cacheMiddleware = (req, res, next) => {
  const { originalUrl, method, serviceResponse } = req;
  if (!serviceResponse || !shouldUseCache(originalUrl, method)) return next();

  const { headers, status, data } = serviceResponse;
  cache.set(`${method}:${originalUrl}`, { headers, status, data }, 120);
};
