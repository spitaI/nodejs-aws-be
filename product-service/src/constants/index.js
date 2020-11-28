export const DEFAULT_HEADERS = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
  },
};

export const SNS_CONFIG = {
  region: 'eu-west-1',
};

export const SNS_PUBLICATION_SUBJECT = 'Product-service notification';
export const SNS_PUBLICATION_MESSAGE = 'New product was added to database: ';

export const BOOK_PAGES_BOUNDARY = 250;

export const FILTER = {
  bookType: {
    BIG: {
      prop: 'pages',
      value: 'big',
      predicate: val => val >= BOOK_PAGES_BOUNDARY,
    },
    TINY: {
      prop: 'pages',
      value: 'tiny',
      predicate: val => val < BOOK_PAGES_BOUNDARY,
    },
  },
};
