import _ from 'lodash';
import actions from './controller.js';
import Users from './component.js';
import structure from './structure.js';

const componentName = _.camelCase(Users.name);

export default {
  componentName,
  actions,
  structure,
  component: Users
};
