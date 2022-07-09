import Aigle from 'aigle';
import _ from 'lodash';
import fs from 'fs';
import { files } from '../../shared/index.js';

let componentsDiscoveryServiceContainer;

/**
 * @typedef {typeof import('./components.js').default extends Promise<infer U> ? U : never} Components
 * @typedef {typeof import('../../shared/BaseEntity.js').default[]} Entities
 * @typedef {{ getSearchPageSeed: Function ?, getProdSeeds: Function, getDevSeeds: Function }[]} Seeds
 * @typedef {{ componentName: string, getComponentActions: Function, getComponentRestrictions: Function, getComponentPermissionsMap: Function }[]} Permissions
 * @typedef {{ registerEventHandlers: (eventService: import('../../services/events/eventEmitter3/EventService.js').default)}[]} Events
 */

class ComponentsDiscoveryService {
  /** @type {Components} */
  #components = {};

  #buildComponentsFile = (components) => {
    const componentsKeys = _.keys(components);
    let componentsFile = 'const getFile = async () => ({\n';
    _.each(componentsKeys, (componentKey) => {
      const importScript = `(await import('../../components/${componentKey}/index.js')).default`;
      componentsFile += `\t${componentKey}: ${importScript},\n`;
    });
    componentsFile = `${_.trimEnd(
      componentsFile,
      '\n,'
    )}\n}); \n\nexport default getFile();\n`;
    const path = files.getFilePath(
      '/src/services/componentsDiscovery/components.js'
    );
    fs.writeFileSync(path, componentsFile);
  };

  #getAllComponents = () => {
    const componentPaths = files.globFiles('/src/components/**/index.js');
    return Aigle.transform(
      componentPaths,
      async (result, componentPath) => {
        const component = (await import(`file:///${componentPath}`)).default;
        result[component.componentName] = component;
      },
      {}
    );
  };

  init = async () => {
    this.#components = await this.#getAllComponents();
    this.#buildComponentsFile(this.#components);
    this.components = this.#components;
  };

  getAllComponents = () => this.#components;

  /** @returns {Components} */
  getAllComponentsClass = () =>
    _.map(this.#components, (component) => component.component);

  /** @returns {Structure} */
  getAllComponentsStructure = () =>
    _.map(this.#components, (component) => component.structure);

  /** @returns {Permissions} */
  getAllComponentsPermissions = () =>
    _.map(this.#components, (component) => component.permissions);

  /** @returns {Events} */
  getAllComponentsEvents = () =>
    _.map(this.#components, (component) => component.events);
}

/** @returns {ComponentsDiscoveryService} */
const initComponentsDiscoveryService = () => {
  if (!componentsDiscoveryServiceContainer) {
    componentsDiscoveryServiceContainer = new ComponentsDiscoveryService();
  }
  return componentsDiscoveryServiceContainer;
};

export default initComponentsDiscoveryService();
