import axios from 'axios';
import visualService from '@/services/visualService';

const { VUE_APP_BACKEND_HOST, VUE_APP_BACKEND_PORT, VUE_APP_BACKEND_PATH_PREFIX } = process.env;
const baseURL = `${VUE_APP_BACKEND_HOST}:${VUE_APP_BACKEND_PORT}/${VUE_APP_BACKEND_PATH_PREFIX}`;
const instance = axios.create({ baseURL });

instance.interceptors.request.use(
	(config) => {
		const userToken = localStorage.getItem('userToken');
		if (userToken) {
			config.headers.Authorization = `Basic ${userToken}`;
		}
		return config;
	},
	(error) => {
		visualService.createToastMessage(`${error.message}. ${error.response?.data.message}.`, 'error', 3000);
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		visualService.createToastMessage(`${error.message}. ${error.response?.data.message}.`, 'error', 3000);
		return Promise.reject(error);
	}
);

export default instance;
