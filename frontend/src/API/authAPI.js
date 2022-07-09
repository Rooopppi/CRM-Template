import HttpService from './httpService.js';

class AuthAPI {
	login = async (data) => {
		const response = await HttpService.post('/auth/auth', data);
		if (!response.data.authToken) {
			return false;
		}
		const token = response.data.authToken;
		localStorage.setItem('userToken', token);
		return true;
	};
}

export default new AuthAPI();
