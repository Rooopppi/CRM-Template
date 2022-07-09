import 'vue-snotify/styles/material.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import './registerServiceWorker.js';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import App from './App.vue';
import buildRoutes from './router/index.js';
import store from './store/index.js';
import vuetify from './plugins/vuetify.js';
import Translations from './locales/index.js';
import VueResource from 'vue-resource';
import Snotify, { SnotifyPosition } from 'vue-snotify';
import CountryFlag from 'vue-country-flag';

const main = async () => {
	const options = {
		toast: {
			bodyMaxLength: 300,
			position: SnotifyPosition.centerTop
		}
	};
	Vue.config.productionTip = false;
	Vue.use(VueRouter);
	Vue.use(VueI18n);
	Vue.use(VueResource);
	Vue.use(Snotify, options);
	Vue.component('country-flag', CountryFlag);

	const i18n = new VueI18n({ locale: 'en', messages: Translations });
	const router = await buildRoutes();

	new Vue({
		router,
		store,
		vuetify,
		i18n,
		render: (createElement) => createElement(App)
	}).$mount('#app');
};

main();
