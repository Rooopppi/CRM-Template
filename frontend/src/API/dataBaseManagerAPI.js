import HttpService from './httpService';

class DataBaseManagerAPI {
	search() {
		return HttpService.get('/dataBaseManager/search');
	}

	remove(data) {
		return HttpService.delete('/dataBaseManager/remove', data);
	}

	update(data) {
		return HttpService.put('/dataBaseManager/update', data);
	}

	create(data) {
		return HttpService.post('/dataBaseManager/create', data);
	}

	getDatabaseServices() {
		return HttpService.get('/dataBaseManager/getDatabaseServices');
	}
}

export default new DataBaseManagerAPI();
