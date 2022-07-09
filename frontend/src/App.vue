<template>
	<v-app>
		<section>
			<v-theme-provider>
				<layout-sidebar :state-sidebar="toggle" v-if="isUserHasToken" />
			</v-theme-provider>
			<v-main>
				<layout-header @click-on-menu="toggleShade" v-if="isUserHasToken" />
				<div class="layout" v-if="toggle" @click="toggleShade" />
				<layout-body :style="styleOfBody" />
			</v-main>
		</section>
		<div id="modalContainer" />
		<vue-snotify />
	</v-app>
</template>

<script>
export default {
	name: 'App',
	components: {
		'layout-header': () => import('@/components/layout/Header.vue'),
		'layout-sidebar': () => import('@/components/layout/Sidebar.vue'),
		'layout-body': () => import('@/components/layout/Body.vue')
	},
	data() {
		return {
			toggle: false,
			styleOfBody: 'opacity: 100%'
		};
	},
	computed: {
		isUserHasToken() {
			return this.$store.state.userToken;
		}
	},
	methods: {
		toggleShade() {
			this.toggle = !this.toggle;
			this.styleOfBody = this.toggle ? 'opacity: 20%;' : 'opacity: 100%';
		}
	},
	mounted() {
		const theme = this.$vuetify.theme.options.themeCache.get('isBlackTheme');
		this.$vuetify.theme.dark = theme ? JSON.parse(theme) : true;
		const locale = this.$store.state.locale;
		this.$i18n.locale = locale || 'en';
	}
};
</script>

<style scoped>
section {
	display: flex;
	width: 100%;
	height: 100%;
}

.layout {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
}
</style>
<style>
html {
	overflow: hidden !important;
}
</style>
