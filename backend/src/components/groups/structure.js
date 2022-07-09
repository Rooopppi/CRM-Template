import { dataTypes } from '../../shared/index.js';

const tableStructure = [
  {
    name: 'id',
    type: dataTypes.bigInteger,
    defaultValue: 'AUTO_INCREMENT',
    primaryKey: true
  },
  {
    name: 'name',
    type: dataTypes.longText
  },
  {
    name: 'permissions',
    type: dataTypes.json
  }
];
const seeds = [
  {
    name: 'Admin',
    permissions: JSON.stringify({
      users: ['search', 'create', 'update', 'remove'],
      groups: [
        'search',
        'create',
        'update',
        'remove',
        'getAllComponentsPermissions'
      ],
      dataBaseManager: [
        'search',
        'create',
        'update',
        'remove',
        'getDatabaseServices'
      ],
      auth: ['auth']
    })
  }
];

export default { tableStructure, seeds };
