import * as csv from 'csv-parser';

import {
  getS3Conn,
  getS3ParseParams,
  getS3CopyParams,
  getResponseObject,
} from '../utils';

export const importFileParser = async event => {
  try {
    await new Promise((resolve, reject) => {
      for (const record of event.Records) {
        const s3 = getS3Conn();
        const recordKey = record.s3.object.key;
        const params = getS3ParseParams(recordKey);
        s3.getObject(params)
          .createReadStream()
          .pipe(csv())
          .on('data', data => {
            console.log('Data:', data);
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
