import HttpService from './httpService';

class GroupsAPI {
	search() {
		return HttpService.get('/groups/search');
	}

	remove(data) {
		return HttpService.delete('/groups/remove', data);
	}

	update(data) {
		return HttpService.put('/groups/update', data);
	}

	create(data) {
		return HttpService.post('/groups/create', data);
	}

	getAllComponentsPermissions() {
		return HttpService.get('/groups/getAllComponentsPermissions');
	}
}

export default new GroupsAPI();
