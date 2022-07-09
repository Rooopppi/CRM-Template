import _ from 'lodash';
import ServicesManager from '../../services/index.js';
import { generateBasicFunctions } from '../../shared/basicComponent.js';
import Groups from './component.js';

const { search, create, remove, update } = generateBasicFunctions(Groups);

const getAllComponentsPermissions = (request, response, next) => {
  const { ComponentsDiscoveryService } = ServicesManager.getServices();
  const componentObjects = ComponentsDiscoveryService.getAllComponents();

  const componentsMap = _.transform(
    componentObjects,
    (result, { actions, componentName }) => {
      (result[componentName] || (result[componentName] = [])).push(
        _.map(actions, ({ name }) => name)
      );
    },
    {}
  );

  next(null, componentsMap);
};

export default { search, create, remove, update, getAllComponentsPermissions };
