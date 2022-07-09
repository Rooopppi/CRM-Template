import Aigle from 'aigle';
import _ from 'lodash';
import ServiceManager from '../services/index.js';

const commandName = 'bootstrap:dev';

const commandFunction = async () => {
  const { ComponentsDiscoveryService, DataBaseManager } =
    ServiceManager.getServices();
  const MariaDBConnector = DataBaseManager.getLocalConnection();
  const { queryHelper } = MariaDBConnector;
  const allComponents = ComponentsDiscoveryService.getAllComponents();
  const { DB_NAME, DB_USER } = process.env;
  console.log('Creating data base');
  queryHelper.dropDataBase(DB_NAME);
  queryHelper.createDataBase(DB_NAME);

  queryHelper.useDataBase(DB_NAME);
  await MariaDBConnector.sendQuery(
    `GRANT EXECUTE, SELECT, SHOW VIEW, ALTER, ALTER ROUTINE, CREATE, CREATE ROUTINE, CREATE TEMPORARY TABLES, CREATE VIEW, DELETE, DROP, EVENT, INDEX, INSERT, REFERENCES, TRIGGER, UPDATE, LOCK TABLES  ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%' WITH GRANT OPTION;`
  );
  await MariaDBConnector.sendQuery('FLUSH PRIVILEGES;');

  const bootstrappedComponents = _.filter(
    allComponents,
    (component) => component?.structure != null && component?.component != null
  );

  const componentsWithForeignKeys = _.filter(
    bootstrappedComponents,
    (component) =>
      _.size(
        _.filter(component.structure.tableStructure, (field) => {
          return _.has(field, 'foreignKey');
        })
      ) > 0
  );
  const componentNames = _.map(
    componentsWithForeignKeys,
    ({ componentName }) => componentName
  );
  const componentsWithoutForeignKeys = _.filter(
    bootstrappedComponents,
    (component) => !_.includes(componentNames, component.componentName)
  );

  await Aigle.each(
    componentsWithoutForeignKeys,
    async ({ structure, component }) => {
      const { tableStructure, seeds } = structure;
      const tableName = _.snakeCase(component.name);
      console.log(`Creating table ${tableName}`);
      await queryHelper.createTable(tableName, tableStructure);
      console.log(`Seeding table ${tableName}`);
      await Aigle.each(seeds, (seed) => queryHelper.insert(tableName, seed));
    }
  );

  await Aigle.each(
    componentsWithForeignKeys,
    async ({ structure, component }) => {
      const { tableStructure, seeds } = structure;
      const tableName = _.snakeCase(component.name);
      console.log(`Creating table ${tableName}`);
      await queryHelper.createTable(tableName, tableStructure);
      console.log(`Seeding table ${tableName}`);
      await Aigle.each(seeds, (seed) => queryHelper.insert(tableName, seed));
    }
  );

  console.log('Finished');
};

export { commandFunction, commandName };
