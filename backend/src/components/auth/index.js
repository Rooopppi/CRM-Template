import _ from 'lodash';
import actions from './controller.js';

const componentName = 'auth';

const publicFunctions = [actions.auth.name];

export default {
  componentName,
  actions,
  publicFunctions
};
