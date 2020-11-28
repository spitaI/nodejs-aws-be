import csv from 'csv-parser';

import {
  getS3Conn,
  getSQSQueue,
  getSQSUrl,
  getS3ParseParams,
  getS3CopyParams,
  getResponseObject,
  castProduct,
} from '../utils';

export const importFileParser = async event => {
  try {
    const sqs = getSQSQueue();
    await new Promise((resolve, reject) => {
      for (const record of event.Records) {
        const s3 = getS3Conn();
        const recordKey = record.s3.object.key;
        const params = getS3ParseParams(recordKey);
        s3.getObject(params)
          .createReadStream()
          .pipe(csv())
          .on('data', async data => {
            const product = castProduct(data);
            await sqs
              .sendMessage({
                QueueUrl: getSQSUrl(),
                MessageBody: JSON.stringify(product),
              })
              .promise();
          })
          .on('end', async () => {
            const copyParams = getS3CopyParams(recordKey);
            await s3.copyObject(copyParams).promise();
            await s3.deleteObject(params).promise();
            resolve();
          })
          .on('error', error => {
            console.log('Error:', error);
            reject(error);
          });
      }
    });

    return getResponseObject(202);
  } catch (e) {
    return getResponseObject(500, {
      error: 'Internal server error',
    });
  }
};
