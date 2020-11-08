import { products } from '../handlers/__mock__';
import { DbHelper } from './db';

export class ProductHelper extends DbHelper {
  constructor(options) {
    super(options);
  }

  async _getProductsList(client) {
    const { rows: productsList } = await client.query(
      `
      SELECT p.*, s.count FROM products p
      LEFT JOIN stock s
      ON p.id = s.product_id
    `,
    );
    return productsList;
  }

  async getProductsList() {
    return await this.withTransaction(this._getProductsList);
  }

  async _getProductById(client, { id }) {
    const { rows: product } = await client.query(
      `
      SELECT p.*, s.count FROM products p
      LEFT JOIN stock s
      ON p.id = s.product_id
      WHERE p.id = $1
    `,
      [id],
    );
    return product;
  }

  async getProductById(id) {
    return await this.withTransaction(this._getProductById, { id });
  }

  async _createProduct(
    client,
    { title, summary, author, pages, published, price, image, count },
  ) {
    const { rows } = await client.query(
      `
      INSERT INTO products (title, summary, author, pages, published, price, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `,
      [title, summary, author, pages, published, price, image],
    );
    const [{ id }] = rows;

    await client.query(
      `
      INSERT INTO stock (count, product_id)
      VALUES ($1, $2)
    `,
      [count, id],
    );
    return id;
  }

  async createProduct(product) {
    return await this.withTransaction(this._createProduct, { ...product });
  }
}
