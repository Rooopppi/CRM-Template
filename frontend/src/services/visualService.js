import Vue from 'vue';
import CustomModal from '@/components/modal/CustomModal.vue';
import vuetify from '@/plugins/vuetify.js';
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue';
import VueI18n from 'vue-i18n';
import Translations from '@/locales/index.js';
import store from '@/store/index.js';

const createModal = ({ title, component, width, height, props, actions }) => {
	const ModalClass = Vue.extend(CustomModal);
	const i18n = new VueI18n({ locale: store.state.locale, messages: Translations });

	const modalInstance = new ModalClass({
		vuetify,
		i18n,
		propsData: {
			height,
			width,
			title,
			component,
			props
		},
		methods: {
			...actions,
			close: removeNewNode
		}
	});
	modalInstance.$mount();

	appendNode(modalInstance);
	hideNewNode();
};

function appendNode(modalInstance) {
	const modalContainer = document.getElementById('modalContainer');
	modalContainer.appendChild(modalInstance.$el);
}

function hideNewNode() {
	const elements = document.querySelectorAll('#app');
	elements[elements.length - 1].style.position = 'absolute';
}

function removeNewNode() {
	const elements = document.querySelectorAll('#app');
	elements[elements.length - 1].remove();
}

const createToastMessage = (message, type, timer) => {
	const context = new Vue();
	context.$snotify[type](message, type.toUpperCase(), {
		timeout: timer
	});
};

const createConfirmationModal = ({ title, actions }) => {
	const ModalClass = Vue.extend(ConfirmationModal);

	const i18n = new VueI18n({ locale: store.state.locale, messages: Translations });

	const modalInstance = new ModalClass({
		vuetify,
		i18n,
		propsData: {
			title
		},
		methods: {
			close: removeNewNode,
			...actions
		}
	});
	modalInstance.$mount();

	appendNode(modalInstance);
	hideNewNode();
};

export default { createModal, createToastMessage, createConfirmationModal };
