import * as productController from '../controllers/product';
import { SNS_PUBLICATION_SUBJECT } from '../constants';
import {
  getSNSTopic,
  getSNSArn,
  getSNSPublicationMessage,
  validateProduct,
  getResponseObject,
  withLogger,
  getFilterValues,
  getSNSPublicationMessageAttrs,
} from '../utils';

export const catalogBatchProcess = async event => {
  const sns = getSNSTopic();
  const createdProducts = [];

  try {
    for (const record of event.Records) {
      const { body } = record;
      const product = JSON.parse(body);

      const { error } = validateProduct(product);
      if (error) continue;

      await productController.createProduct(product);
      createdProducts.push(product);

      const filterValues = getFilterValues(product);
      await sns
        .publish({
          Subject: SNS_PUBLICATION_SUBJECT,
          Message: getSNSPublicationMessage(product),
          TopicArn: getSNSArn(),
          MessageAttributes: getSNSPublicationMessageAttrs(filterValues),
        })
        .promise();
    }

    return getResponseObject(202, { data: createdProducts });
  } catch (e) {
    return getResponseObject(500, { error: 'Internal server error' });
  }
};

export default withLogger('catalogBatchProcess')(catalogBatchProcess);
