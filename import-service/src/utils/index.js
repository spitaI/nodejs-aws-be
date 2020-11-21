import * as AWS from 'aws-sdk';

import {
  DEFAULT_HEADERS,
  S3_CONFIG,
  S3_DEFAULT_PARAMS,
  IMPORT_BUCKET_NAME,
  UPLOADED_DIRNAME,
  PARSED_DIRNAME,
} from '../constants';

export const getResponseObject = (statusCode, body) => ({
  statusCode,
  ...(body && { body: JSON.stringify(body) }),
  ...DEFAULT_HEADERS,
});

export const getS3Conn = () => new AWS.S3(S3_CONFIG);

export const getS3ImportParams = name => ({
  ...S3_DEFAULT_PARAMS,
  Bucket: IMPORT_BUCKET_NAME,
  Key: `${UPLOADED_DIRNAME}/${name}`,
  ContentType: 'text/csv',
});

export const getS3ParseParams = recordKey => ({
  Bucket: IMPORT_BUCKET_NAME,
  Key: recordKey,
});

export const getS3CopyParams = recordKey => ({
  Bucket: IMPORT_BUCKET_NAME,
  CopySource: `${IMPORT_BUCKET_NAME}/${recordKey}`,
  Key: recordKey.replace(UPLOADED_DIRNAME, PARSED_DIRNAME),
});
