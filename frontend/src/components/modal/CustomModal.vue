<template>
	<v-app>
		<Transition name="modal">
			<div class="modal-mask" v-if="isModalShowed">
				<div class="modal-wrapper">
					<div class="modal-container" :style="styleOfModal">
						<h1>{{ title }}</h1>
						<inner-component />
					</div>
				</div>
			</div>
		</Transition>
	</v-app>
</template>

<script>
import Vue from 'vue';
import vuetify from '@/plugins/vuetify.js';

export default {
	data() {
		return {
			isModalShowed: true
		};
	},
	props: {
		height: {
			type: String,
			default: () => ''
		},
		width: {
			type: String,
			default: () => ''
		},
		title: {
			type: String,
			default: () => ''
		},
		component: {
			type: Object,
			default: () => {}
		},
		props: {
			type: Object,
			default: () => {}
		}
	},
	methods: {
		close() {
			this.isModalShowed = !this.isModalShowed;
			this.$emit('close');
		},
		submit(field) {
			this.$emit('submit', field);
		}
	},
	computed: {
		styleOfModal() {
			return `width: ${this.width}; height: ${this.height}; 
				background-color: ${this.$vuetify.theme.dark ? 'black' : 'white'};`;
		}
	},
	beforeMount() {
		Vue.component('inner-component', {
			vuetify,
			render: (createElement) =>
				createElement(this.component, {
					props: {
						...this.props
					},
					on: {
						close: this.close,
						submit: this.submit
					}
				})
		});
	}
};
</script>

<style scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	transition: opacity 0.3s ease;
	overflow: auto;
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal-wrapper {
	display: table-cell;
	vertical-align: middle;
}

.modal-container {
	margin: 0px auto;
	padding: 20px 30px;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
}
</style>
