import Aigle from 'aigle';
import _ from 'lodash';
import databases from '../databases/index.js';

let dataBaseManagerContainer;

class DataBaseManager {
  #connections = [];

  #connectionDetails = [];

  #localConnection = null;

  #connectors = {};

  getAllDataBaseConnectors = () => this.#connectors;

  getAllConnections = () => this.#connections;

  getConnectionByID = (connectionID) =>
    _.find(this.#connectionDetails, { id: connectionID }) || null;

  setConnection = (connection) => {
    const index = _.findIndex(this.#connectionDetails, { id: connection.id });
    if (index > -1) this.clearConnectionByID(connection.id);
    this.#connectionDetails.push(connection);
    return this.#connectionDetails;
  };

  clearConnectionByID = (connectionID) => {
    const index = _.findIndex(this.#connectionDetails, { id: connectionID });
    if (index > -1) this.#connectionDetails.splice(index, 1);
  };

  setAllExternalConnections = async () => {
    try {
      const result = await this.#localConnection.queryHelper.select(
        _.snakeCase(DataBaseManager.name)
      );
      this.#connectionDetails = result;
    } catch (error) {
      console.log({ error });
      return error;
    }
  };

  getConnectionByIDFromDB = async (connectionID) => {
    const where = [
      {
        fieldName: 'id',
        fieldValue: connectionID,
        tableName: 'data_base_manager'
      }
    ];
    const result = await this.#localConnection.queryHelper.select(
      _.snakeCase(DataBaseManager.name),
      null,
      where
    );
    return result;
  };

  getLocalConnection = () => {
    return this.#localConnection;
  };

  init = async (createOnlyLocalConnection = false) => {
    console.log('init DB');
    this.#localConnection = new databases.MariaDBConnector();
    await this.#localConnection.start(true);
    console.log('Local DB connection is set');

    this.#connectors = databases;

    if (!createOnlyLocalConnection) {
      console.log('Performing new connections to external dbs...');
      await this.setAllExternalConnections();

      const isSetUp = false;
      await Aigle.each(this.#connectionDetails, async (connection) => {
        const newConnection = new databases[connection.databaseService]();
        await newConnection.start(isSetUp, connection);
        this.#connections.push({
          id: connection.id,
          connection: newConnection
        });
      });
    }
  };
}

const initServicesMarager = () => {
  if (!dataBaseManagerContainer) {
    dataBaseManagerContainer = new DataBaseManager();
  }
  return dataBaseManagerContainer;
};

export default initServicesMarager();
