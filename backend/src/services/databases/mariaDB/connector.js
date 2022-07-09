import mariadb from 'mariadb';
import MariaDBQueryHelper from './queryHelper.js';

class MariaDBConnector {
  constructor() {
    this.connection = null;
    this.connected = false;
    this.queryHelper = new MariaDBQueryHelper(this);
  }

  #DB_PORT;
  #DB_HOST;
  #DB_USER;
  #DB_NAME;
  #DB_PASSWORD;
  #DB_CONNECTION_LIMIT;
  #DB_ROOT_PASS;

  start = async (isSetUp, connectionConfig) => {
    if (!connectionConfig) {
      this.#DB_PORT = process.env.DB_PORT;
      this.#DB_HOST = process.env.DB_HOST;
      this.#DB_USER = process.env.DB_USER;
      this.#DB_NAME = process.env.DB_NAME;
      this.#DB_PASSWORD = process.env.DB_PASSWORD;
      this.#DB_CONNECTION_LIMIT = process.env.DB_CONNECTION_LIMIT;
      this.#DB_ROOT_PASS = process.env.DB_ROOT_PASS;
    } else {
      this.#DB_PORT = connectionConfig.databasePort;
      this.#DB_HOST = connectionConfig.databaseHost;
      this.#DB_USER = connectionConfig.databaseUser;
      this.#DB_NAME = connectionConfig.databaseName;
      this.#DB_PASSWORD = connectionConfig.databasePassword;
      this.#DB_CONNECTION_LIMIT = connectionConfig.databaseConnectionLimit;
      this.#DB_ROOT_PASS = process.env.DB_ROOT_PASS;
    }

    this.databaseName = this.#DB_NAME || null;

    this.connectionSettings = {
      port: this.#DB_PORT,
      host: this.#DB_HOST,
      user: this.#DB_USER,
      password: this.#DB_PASSWORD,
      database: this.#DB_NAME,
      connectionLimit: this.#DB_CONNECTION_LIMIT
    };

    if (isSetUp) {
      delete this.connectionSettings.database;
      this.connectionSettings.user = 'root';
      this.connectionSettings.password = this.#DB_ROOT_PASS;
    }
    this.pool = mariadb.createPool(this.connectionSettings);
    try {
      this.connection = await this.pool.getConnection();
      this.connected = true;
      console.log(`DB connected to ${this.connectionSettings.host}`);
      if (this.databaseName) this.sendQuery(`USE ${this.databaseName};`);
    } catch (error) {
      console.log('DB connection error: ', error.text);
      this.connected = false;
      return error.text;
    }
  };

  sendQuery = async (sqlQueryString) => {
    if (this.connected) {
      try {
        const requestResult = await this.connection.query(sqlQueryString);
        return requestResult;
      } catch (error) {
        return error.text;
      }
    } else {
      console.log('You must create connection before sending a query');
    }
  };
}

export default MariaDBConnector;
