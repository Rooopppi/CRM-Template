import _ from 'lodash';
import Groups from '../../components/groups/component.js';

let permissionsServiceContainer;

class PermissionService {
  #cachedPermissions = [];

  getAllUsersPermissions = () => this.#cachedPermissions;

  getPermissionsByGroupId = async (groupId) => {
    const cachedPermissions = _.find(this.#cachedPermissions, { groupId });
    if (_.size(cachedPermissions) > 0) {
      return cachedPermissions?.permissions;
    }
    const groupsComponent = new Groups();
    const [permissions] = await groupsComponent.findBy({
      fields: ['permissions'],
      where: { fieldName: 'id', fieldValue: `${groupId}`, tableName: 'groups' }
    });
    return permissions?.permissions;
  };

  setPermissionsByGroupId = (groupId, permissions) => {
    const index = _.findIndex(this.#cachedPermissions, { groupId });
    if (index > -1) this.clearPermissionsByGroupId(groupId);
    this.#cachedPermissions.push({ groupId, permissions });
    return this.#cachedPermissions;
  };

  clearPermissionsByGroupId = (groupId) => {
    const index = _.findIndex(this.#cachedPermissions, { groupId });
    this.#cachedPermissions.splice(index, 1);
  };
}

const initPermissionsService = () => {
  if (!permissionsServiceContainer) {
    permissionsServiceContainer = new PermissionService();
  }
  return permissionsServiceContainer;
};

export default initPermissionsService();
