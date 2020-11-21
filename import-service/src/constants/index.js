export const DEFAULT_HEADERS = {
  headers: {
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
  },
};

export const IMPORT_BUCKET_NAME = 'spitai-import';

export const UPLOADED_DIRNAME = 'uploaded';
export const PARSED_DIRNAME = 'parsed';

export const S3_CONFIG = {
  region: 'eu-west-1',
};

export const S3_DEFAULT_PARAMS = {
  Expires: 60,
};

export const S3_PUT_OPERATION = 'putObject';
