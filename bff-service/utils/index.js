import { CACHE_CONFIG } from '../constants';

export const getServiceUrl = serviceName => {
  const serviceUrl = process.env[serviceName];
  if (!serviceUrl) {
    throw new Error('Cannot process request');
  }

  return serviceUrl;
};

export const shouldUseCache = (originalUrl, method) => {
  for (const c of CACHE_CONFIG) {
    if (originalUrl.startsWith(c.path) && c.methods.includes(method))
      return true;
  }
  return false;
};
