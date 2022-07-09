import VueRouter from 'vue-router';
import { RouterService } from '../services/index.js';
import Login from '../views/login/Login';
import visualService from '@/services/visualService';

const buildRoutes = async () => {
	const routerService = new RouterService();
	const generatedRoutes = await routerService.getRoutes();

	const router = new VueRouter({
		mode: 'history',
		routes: [
			...generatedRoutes,
			{
				name: 'login',
				path: '/login',
				component: Login
			}
		]
	});

	router.beforeEach((to, from, next) => {
		const userToken = localStorage.getItem('userToken');
		const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
		if (!requiresAuth) {
			next();
		}
		if (!userToken) {
			next({ name: 'login' });
		} else {
			// check if TTL of token is still bigger than now() time
			// eslint-disable-next-line
			const [_someUselessStuff, jwtPayload] = userToken.split('.');
			const decodedJwt = JSON.parse(atob(jwtPayload));
			const isTokenExpired = decodedJwt.exp * 1000 < Date.now();
			if (isTokenExpired) {
				visualService.createToastMessage('Your session is expired. Please log in.', 'error', 3000);
				next({ name: 'login' });
			}
		}

		next();
	});

	return router;
};

export default buildRoutes;
