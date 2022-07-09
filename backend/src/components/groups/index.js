import _ from 'lodash';
import actions from './controller.js';
import Groups from './component.js';
import structure from './structure.js';

const componentName = _.camelCase(Groups.name);

export default { componentName, actions, structure, component: Groups };
