import _ from 'lodash';
import ServicesManager from '../../services/index.js';
import { BasicComponent } from '../../shared/basicComponent.js';

class Groups extends BasicComponent {
  // this class is used to store components db structure
  // also contains some custom functions and permissions manager for fields

  findBy = (request) => {
    const { fields, where } = request;
    const results = this.queryHelper.select(
      _.snakeCase(Groups.name),
      fields,
      where
    );
    return results;
  };

  constructor(data) {
    super(data);
    this.id = data?.id;
    this.name = data?.name;
    this.permissions = data?.permissions;
    this.queryHelper =
      ServicesManager.getServices().DataBaseManager.getLocalConnection().queryHelper;
  }
}

export default Groups;
