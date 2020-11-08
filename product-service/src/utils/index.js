import Joi from 'joi';

import { DEFAULT_HEADERS } from '../constants';

export const getResponseObject = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
  ...DEFAULT_HEADERS,
});

export const withLogger = handlerName => handler => async event => {
  console.info(
    `${handlerName} handler invoked${
      event && ` with event: ${JSON.stringify(event, null, 2)}`
    }`,
  );
  return await handler(event);
};

export const validateProduct = product => {
  const productSchema = Joi.object().keys({
    title: Joi.string()
      .required()
      .error(new Error('A title should be provided')),
    summary: Joi.string()
      .required()
      .error(new Error('A summary should be provided')),
    author: Joi.string().allow(''),
    pages: Joi.number().integer(),
    published: Joi.string().allow(''),
    price: Joi.number().required().min(0),
    image: Joi.string().allow(''),
    count: Joi.number().integer().min(0).required(),
  });
  return productSchema.validate(product);
};
