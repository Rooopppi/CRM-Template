import _ from 'lodash';
import Aigle from 'aigle';
import store from '../store/index.js';

export class RouterService {
	#sidebarPaths = [];
	#getRoutes = async () => {
		const buildComponents = [];
		const allPathsWithFiles = await require.context('/src/views/', true, /index.vue$/, 'lazy');
		const keys = allPathsWithFiles.keys();
		await Aigle.each(keys, async (dirtyPath) => {
			const loadedModules = await allPathsWithFiles(dirtyPath);
			const component = loadedModules.default;
			const path = this.#clearRoutePath(dirtyPath); 
			this.#sidebarPaths.push(path);
			buildComponents.push({
				path,
				component,
				meta: {
					requiresAuth: true
				}
			});
		});
		this.#buildSidebar();
		return buildComponents;
	};
	#clearRoutePath = (dirtyRoutePath) => _.replace(_.replace(dirtyRoutePath, '/index.vue', ''), './', '/');
	getRoutes = () => {
		return this.#getRoutes();
	};
	#buildSidebar = () => {
		const menu = [];
		const sections = _.uniq(
			_.map(this.#sidebarPaths, (path) => {
				// eslint-disable-next-line no-unused-vars
				const [_prefix, sectionName, title] = _.split(path, '/');
				menu.push({
					title,
					section: sectionName
				});
				return sectionName;
			})
		);
		const sidebar = {
			sections,
			menu
		};
		store.commit('sidebarMenu', sidebar);
	};
}
