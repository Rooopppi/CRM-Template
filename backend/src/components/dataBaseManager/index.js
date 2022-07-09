import _ from 'lodash';
import actions from './controller.js';
import DataBaseManager from './component.js';
import structure from './structure.js';

const componentName = _.camelCase(DataBaseManager.name);

export default {
  componentName,
  actions,
  structure,
  component: DataBaseManager
};
