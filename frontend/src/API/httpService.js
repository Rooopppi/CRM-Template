import axios from './instance';
class HttpService {
	async get(endpoint) {
		const getResult = await axios.get(endpoint);
		return getResult?.data ?? getResult;
	}

	async delete(endpoint, data) {
		const deleteResult = await axios.delete(endpoint, { data });
		return deleteResult?.data ?? deleteResult;
	}

	async put(endpoint, data) {
		const putResult = await axios.put(endpoint, data);
		return putResult?.data ?? putResult;
	}

	async post(endpoint, data) {
		const postResult = await axios.post(endpoint, data);
		return postResult?.data ?? postResult;
	}
}

export default new HttpService();
