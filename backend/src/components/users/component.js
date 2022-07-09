import _ from 'lodash';
import ServicesManager from '../../services/index.js';
import { BasicComponent } from '../../shared/basicComponent.js';
import { encryption } from '../../shared/index.js';

class Users extends BasicComponent {
  // this class is used to store components db structure
  // also contains some custom functions and permissions manager for fields

  constructor(data) {
    super(data);
    this.email = data?.email;
    this.group = data?.group;
    this.password = data?.password;
    this.userName = data?.userName;
    this.userToken = data?.userToken;
    this.queryHelper =
      ServicesManager.getDataBaseManager().getLocalConnection().queryHelper;
  }

  findBy = (request) => {
    const { fields, where } = request;
    const results = this.queryHelper.select(
      _.snakeCase(Users.name),
      fields,
      where
    );
    return results;
  };

  generatedValues = (fields) => {
    const { id, userName } = fields;
    const userToken = encryption.generateToken({
      id,
      userName
    });

    fields.password = encryption.md5(fields.password);
    return { ...fields, ...{ userToken } };
  };
}

export default Users;
