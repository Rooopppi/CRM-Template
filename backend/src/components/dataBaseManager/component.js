import { BasicComponent } from '../../shared/basicComponent.js';

class DataBaseManager extends BasicComponent {
  constructor(data) {
    super(data);
    this.id = data?.id;
    this.connectionName = data?.connectionName;
    this.databaseHost = data?.databaseHost;
    this.databasePort = data?.databasePort;
    this.databaseUser = data?.databaseUser;
    this.databasePassword = data?.databasePassword;
    this.databaseName = data?.databaseName;
    this.databaseConnectionLimit = data?.databaseConnectionLimit;
    this.databaseService = data?.databaseService;
  }
}

export default DataBaseManager;
