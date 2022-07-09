import { dataTypes, encryption } from '../../shared/index.js';

const tableStructure = [
  {
    name: 'id',
    type: dataTypes.bigInteger,
    defaultValue: 'AUTO_INCREMENT',
    primaryKey: true
  },
  {
    name: 'email',
    type: dataTypes.longText
  },
  {
    name: 'password',
    type: dataTypes.longText
  },
  {
    name: 'userName',
    type: dataTypes.longText
  },
  {
    name: 'group',
    type: dataTypes.bigInteger,
    foreignKey: { table: 'groups', field: 'id' }
  },
  {
    name: 'userToken',
    type: dataTypes.longText
  }
];
const seeds = [
  {
    email: 'test@test.com',
    password: encryption.md5('test'),
    group: 1,
    userName: 'Test',
    userToken: encryption.generateToken({
      id: 1,
      group: 1,
      userName: 'Test'
    })
  }
];

export default { tableStructure, seeds };
