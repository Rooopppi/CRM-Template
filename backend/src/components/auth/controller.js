import _ from 'lodash';
import { encryption } from '../../shared/index.js';
import permissionsService from '../../services/permissionsService/permissionsService.js';
import componentsDiscoveryService from '../../services/componentsDiscovery/componentsDiscoveryService.js';
import ServicesManager from '../../services/index.js';
import Groups from '../groups/component.js';

const auth = async (request, response, next) => {
  const { email, password } = request.body;

  const { queryHelper } =
    ServicesManager.getDataBaseManager().getLocalConnection();

  const databaseAuthResult = await queryHelper.select(
    'users',
    ['group', 'userName', 'id'],
    {
      method: 'AND',
      cases: [
        {
          tableName: 'users',
          fieldName: 'email',
          fieldValue: email,
          mode: 'EQ'
        },
        {
          tableName: 'users',
          fieldName: 'password',
          fieldValue: encryption.md5(password),
          mode: 'EQ'
        }
      ]
    },
    null,
    1
  );

  if (!_.size(databaseAuthResult)) {
    return next(null, []);
  }

  const [userData] = databaseAuthResult;
  const newToken = encryption.generateToken({
    id: userData.id,
    userName: userData.userName,
    group: userData.group,
    ip:
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress ||
      null,
    client: request.headers['user-agent']
  });

  await queryHelper.update(
    'users',
    { userToken: newToken },
    { tableName: 'users', fieldName: 'id', fieldValue: userData.id, mode: 'EQ' }
  );

  const authResultObject = {
    authToken: newToken,
    id: userData.id,
    userName: userData.userName
  };

  // PERMISSION
  const groupId = userData.group;
  const fields = ['permissions'];
  const where = {
    tableName: 'groups',
    fieldName: 'id',
    fieldValue: `${groupId}`,
    mode: 'EQ'
  };

  const getPermissions = async (fields, where) => {
    const requestBody = { fields, where };
    const [result] = await new Groups().findBy(requestBody);
    const { permissions } = result;
    return permissions;
  };

  const permissions = await getPermissions(fields, where);
  permissionsService.setPermissionsByGroupId(groupId, permissions);

  next(null, authResultObject);
};

export default { auth };
