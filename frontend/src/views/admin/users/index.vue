<template>
	<SearchTablePage :component-name="componentName" :fields-list="fieldsList" :table-create-form="formViewCreateUser" :table-edit-form="formViewEditUser" />
</template>

<script>
import _ from 'lodash';
import ApiService from '@/API/apiService.js';
import SearchTablePage from '@/components/generic/search/SearchTablePage';
import FormViewCreateUser from '@/components/forms/FormViewCreateUser';
import FormViewEditUser from '@/components/forms/FormViewEditUser';

export default {
	name: 'Users',

	components: {
		SearchTablePage
	},

	data: () => {
		return {
			componentName: 'user',
			fieldsList: [],
			groupsList: [],
			formViewCreateUser: FormViewCreateUser,
			formViewEditUser: FormViewEditUser
		};
	},

	async beforeMount() {
		await this.getGroups();
		this.getFieldsList();
	},

	watch: {
		'$store.state.locale': function() {
			this.getFieldsList();
		}
	},

	methods: {
		async getGroups() {
			const response = await ApiService.group.search();
			const groups = response.data;
			this.groupsList = this.getGroupsList(groups);
		},

		getFieldsList() {
			this.fieldsList = [
				{
					name: 'id',
					label: this.$t('table.user.fields.id'),
					sortable: false,
					tableValue: 'id',
					property: ['read']
				},
				{
					name: 'userName',
					label: this.$t('table.user.fields.userName'),
					tableValue: 'userName',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'email',
					label: this.$t('table.user.fields.email'),
					tableValue: 'email',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{ name: 'active', label: this.$t('table.user.fields.active'), tableValue: 'active', property: ['read'] },
				{
					name: 'group',
					label: this.$t('table.user.fields.groupName'),
					tableValue: 'groupName',
					type: 'select',
					clearable: true,
					filter: false,
					items: this.groupsList,
					property: ['read', 'edit', 'create', 'search']
				},
				{ name: 'lastLoginTime', label: this.$t('table.user.fields.lastLoginTime'), tableValue: 'lastLoginTime', property: ['read'] },
				{ name: 'actions', label: this.$t('table.user.fields.actions'), tableValue: 'actions', sortable: false, property: ['read'] }
			];
		},

		getGroupsList(groups) {
			return _.map(groups, ({ name, id }) => ({ text: name, value: id }));
		}
	}
};
</script>
