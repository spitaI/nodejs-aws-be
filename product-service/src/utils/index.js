import Joi from 'joi';
import AWS from 'aws-sdk';

import {
  DEFAULT_HEADERS,
  SNS_CONFIG,
  SNS_PUBLICATION_MESSAGE,
  FILTER,
} from '../constants';
import { products } from '../handlers/__mock__';

export const getResponseObject = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
  ...DEFAULT_HEADERS,
});

export const withLogger = handlerName => handler => async event => {
  console.info(
    `${handlerName} handler invoked${
      event && ` with event: ${JSON.stringify(event, null, 2)}`
    }`
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

export const getSNSTopic = () => new AWS.SNS(SNS_CONFIG);

export const getSNSArn = () => process.env.SNS_ARN;

export const getSNSPublicationMessage = product =>
  `${SNS_PUBLICATION_MESSAGE}${JSON.stringify(product)}`;

export const getFilterValues = product =>
  Object.keys(FILTER).reduce((acc, filterKey) => {
    const filterValue = Object.values(FILTER[filterKey]).find(v =>
      v.predicate(product[v.prop])
    );
    return filterValue
      ? {
          ...acc,
          [filterKey]: filterValue.value,
        }
      : acc;
  }, {});

export const getSNSPublicationMessageAttrs = filterValues =>
  Object.keys(FILTER).reduce(
    (acc, filterKey) => ({
      ...acc,
      [filterKey]: {
        DataType: 'String',
        StringValue: filterValues[filterKey],
      },
    }),
    {}
  );
