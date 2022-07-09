import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state() {
		return {
			sidebarMenu: [],
			userToken: localStorage.getItem('userToken'),
			locale: localStorage.getItem('locale')
		};
	},
	mutations: {
		sidebarMenu(state, sidebar) {
			state.sidebarMenu = sidebar;
		},
		userToken(state, token) {
			state.userToken = token;
		},
		locale(state, locale) {
			state.locale = locale;
			localStorage.setItem('locale', locale);
		}
	},
	actions: {},
	modules: {},
	getters: {
		sidebarMenu(state) {
			return state.sidebarMenu;
		}
	}
});
