import _ from 'lodash';
import ServicesManager from '../../services/index.js';
import { generateBasicFunctions } from '../../shared/basicComponent.js';
import DataBaseManager from './component.js';

const { search, create, remove, update } =
  generateBasicFunctions(DataBaseManager);

const getDatabaseServices = (request, response, next) => {
  const dataBaseConnectors =
    ServicesManager.getDataBaseManager().getAllDataBaseConnectors();
  const dataBaseConnectorsList = _.map(dataBaseConnectors, ({ name }) => ({
    text: name,
    value: name
  }));
  next(null, dataBaseConnectorsList);
};

export default { search, create, remove, update, getDatabaseServices };
