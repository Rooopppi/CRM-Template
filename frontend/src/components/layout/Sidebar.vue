<template>
	<v-card class="mx-auto sidebar" width="230" height="100%" v-show="stateSidebar">
		<v-list-item :to="`/`">
			<v-list-item-title class="logo text-lg-h6 mt-16 py-5 pl-3 font-weight-medium">
				{{ $t('logo.title') }}
			</v-list-item-title>
		</v-list-item>
		<v-list>
			<v-list-group 
				v-for="(section, index) in sidebarMenu.sections" 
				:key="index" 
				:value="true" 
				no-action
			>
				<template v-slot:activator>
					<v-list-item-content>
						<v-list-item-title class="text-button">
							<v-list-item-title>{{ $t(`sidebar.${section}.title`) }}</v-list-item-title>
						</v-list-item-title>
					</v-list-item-content>
				</template>
				<v-list-item 
					v-for="(menu, i) in getSectionsMenu(section)" 
					:key="i" 
					:to="`/${section}/${menu.title}`" 
					color="blue"
					class="component__item"
				>
					<v-list-item-title class="text-body-2">
						{{ $t(`sidebar.${section}.menu.${menu.title}.title`) }}
					</v-list-item-title>
				</v-list-item>
			</v-list-group>
		</v-list>
	</v-card>
</template>

<script>
import _ from 'lodash';

export default {
	props: {
		stateSidebar: Boolean
	},
	methods: {
		getSectionsMenu(section) {
			return _.filter(this.sidebarMenu.menu, { section });
		}
	},
	computed: {
		sidebarMenu() {
			return this.$store.state.sidebarMenu;
		}
	}
};
</script>

<style scoped>

.component__item {
	position: relative;
	right: 15%;
	width: 115%;
}

.logo {
	user-select: none;
	cursor: pointer;
}

.sidebar {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 99;
}

</style>
