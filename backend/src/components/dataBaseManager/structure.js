import { dataTypes } from '../../shared/index.js';

const tableStructure = [
  {
    name: 'id',
    type: dataTypes.bigInteger,
    defaultValue: 'AUTO_INCREMENT',
    primaryKey: true
  },
  {
    name: 'connectionName',
    type: dataTypes.longText
  },
  {
    name: 'databaseHost',
    type: dataTypes.longText
  },
  {
    name: 'databasePort',
    type: dataTypes.longText
  },
  {
    name: 'databaseUser',
    type: dataTypes.longText
  },
  {
    name: 'databasePassword',
    type: dataTypes.longText
  },
  {
    name: 'databaseName',
    type: dataTypes.longText
  },
  {
    name: 'databaseConnectionLimit',
    type: dataTypes.bigInteger
  },
  {
    name: 'databaseService',
    type: dataTypes.longText
  }
];

const seeds = [];

export default { tableStructure, seeds };
