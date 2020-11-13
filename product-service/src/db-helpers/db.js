import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export class DbHelper {
  constructor(options = {}) {
    this._dbOptions = {
      host: PG_HOST,
      port: PG_PORT,
      database: PG_DATABASE,
      user: PG_USERNAME,
      password: PG_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 5000,
      ...options,
    };
    this._client = null;
    this.isConnected = false;
  }

  async connect() {
    if (!this._client) return;
    await this._client.connect();
    this.isConnected = true;
  }

  async getClient() {
    if (!this._client) {
      this._client = new Client(this._dbOptions);
    }
    if (!this.isConnected) {
      await this.connect();
    }
    return this._client;
  }

  async closeClient() {
    if (!this._client) return;
    this._client.end();
    this._client = null;
    this.isConnected = false;
  }

  async withTransaction(actionCallback, args) {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await actionCallback(client, args);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw new Error(e.message);
    } finally {
      await this.closeClient();
    }
  }
}
