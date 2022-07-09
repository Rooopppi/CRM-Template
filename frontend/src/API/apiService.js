import UsersAPI from './usersAPI.js';
import GroupsAPI from './groupsAPI.js';
import DataBaseManagerAPI from './dataBaseManagerAPI.js';

class ApiService {
	user = UsersAPI;
	group = GroupsAPI;
	dataBaseManager = DataBaseManagerAPI;

}

export default new ApiService();
