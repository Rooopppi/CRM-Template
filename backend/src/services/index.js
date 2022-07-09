import Aigle from 'aigle';
import componentsDiscoveryService from './componentsDiscovery/componentsDiscoveryService.js';
import dataBaseManager from './dataBaseManager/dataBaseManager.js';

let ServicesManagerContainer;

class ServicesManager {
  #servicesCollection = {};
  #dataBaseManager = {};

  startServices = async (isSetUp = false) => {
    const servicesCollection = [componentsDiscoveryService, dataBaseManager];

    await Aigle.each(servicesCollection, async (service) => {
      const serviceName = service.constructor.name;
      console.log(`Adding Service - ${serviceName} `);
      this.#servicesCollection[serviceName] = service;
      await service.init(isSetUp);
    });
    this.#dataBaseManager = dataBaseManager;
  };

  getServices = () => this.#servicesCollection;

  getDataBaseManager = () => {
    return this.#dataBaseManager;
  };
}
const initServicesManager = () => {
  if (!ServicesManagerContainer) {
    ServicesManagerContainer = new ServicesManager();
  }
  return ServicesManagerContainer;
};

export default initServicesManager();
