import { ProductHelper } from '../db-helpers';

const productHelper = new ProductHelper();

export const getProductsList = async () =>
  await productHelper.getProductsList();

export const getProductById = async id =>
  await productHelper.getProductById(id);

export const createProduct = async product =>
  await productHelper.createProduct(product);
