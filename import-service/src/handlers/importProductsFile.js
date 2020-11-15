import { S3_PUT_OPERATION } from '../constants';
import { getS3Conn, getS3ImportParams, getResponseObject } from '../utils';

export const importProductsFile = async event => {
  const {
    queryStringParameters: { name },
  } = event;
  const s3 = getS3Conn();
  const params = getS3ImportParams(name);
  try {
    const signedUrl = await s3.getSignedUrl(S3_PUT_OPERATION, params);
    return getResponseObject(200, signedUrl);
  } catch (e) {
    return getResponseObject(500, {
      error: 'Internal server error',
    });
  }
};
