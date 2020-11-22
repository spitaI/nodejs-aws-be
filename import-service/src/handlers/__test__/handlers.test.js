import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';

import { importProductsFile } from '../importProductsFile';
import { S3_PUT_OPERATION } from '../../constants';
import { getResponseObject, getS3ImportParams } from '../../utils';

describe('AWS Lambda handlers tests', () => {
  const testName = 'test.csv';
  const getEventMock = name => ({
    queryStringParameters: { name },
  });

  describe('importProductsFile handler tests', () => {
    it('should return correct response', async () => {
      const s3GetSignedUrlMock = jest.fn();
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock('S3', 'getSignedUrl', (operation, params) => {
        s3GetSignedUrlMock();
        expect(operation).toEqual(S3_PUT_OPERATION);
        expect(params).toEqual(getS3ImportParams(testName));
      });

      const eventMock = getEventMock(testName);
      const result = await importProductsFile(eventMock);
      expect(result.statusCode).toEqual(200);
      expect(s3GetSignedUrlMock).toHaveBeenCalledTimes(1);
    });
  });
});
