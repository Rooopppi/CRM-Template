import HttpService from './httpService';

class UsersAPI {
	search() {
		return HttpService.get('/users/search');
	}

	remove(data) {
		return HttpService.delete('/users/remove', data);
	}

	update(data) {
		return HttpService.put('/users/update', data);
	}

	create(data) {
		return HttpService.post('/users/create', data);
	}
}

export default new UsersAPI();
