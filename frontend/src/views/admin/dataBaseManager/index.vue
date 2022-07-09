<template>
	<SearchTablePage :component-name="componentName" :fields-list="fieldsList" :table-create-form="formViewCreateDataBaseManager" :table-edit-form="formViewEditDataBaseManager" />
</template>

<script>
import ApiService from '@/API/apiService.js';
import SearchTablePage from '@/components/generic/search/SearchTablePage';
import FormViewCreateDataBaseManager from '@/components/forms/FormViewCreateDataBaseManager';
import FormViewEditDataBaseManager from '@/components/forms/FormViewEditDataBaseManager';

export default {
	name: 'DatabaseManager',

	components: {
		SearchTablePage
	},

	data: () => {
		return {
			componentName: 'dataBaseManager',
			fieldsList: [],
			databaseServices: [],
			formViewCreateDataBaseManager: FormViewCreateDataBaseManager,
			formViewEditDataBaseManager: FormViewEditDataBaseManager
		};
	},

	async beforeMount() {
		await this.getDatabaseServices();
		this.getFieldsList();
	},

	watch: {
		'$store.state.locale': function () {
			this.getFieldsList();
		}
	},

	methods: {
		async getDatabaseServices() {
			const response = await ApiService.dataBaseManager.getDatabaseServices();
			this.databaseServices = response.data;
		},

		getFieldsList() {
			this.fieldsList = [
				{
					name: 'id',
					label: this.$t('table.dataBaseManager.fields.id'),
					sortable: false,
					tableValue: 'id',
					property: ['read']
				},
				{
					name: 'connectionName',
					label: this.$t('table.dataBaseManager.fields.connectionName'),
					tableValue: 'connectionName',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'databaseHost',
					label: this.$t('table.dataBaseManager.fields.databaseHost'),
					tableValue: 'databaseHost',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'databasePort',
					label: this.$t('table.dataBaseManager.fields.databasePort'),
					tableValue: 'databasePort',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'databaseUser',
					label: this.$t('table.dataBaseManager.fields.databaseUser'),
					tableValue: 'databaseUser',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'databasePassword',
					label: this.$t('table.dataBaseManager.fields.databasePassword'),
					tableValue: 'databasePassword',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'databaseName',
					label: this.$t('table.dataBaseManager.fields.databaseName'),
					tableValue: 'databaseName',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'databaseConnectionLimit',
					label: this.$t('table.dataBaseManager.fields.databaseConnectionLimit'),
					tableValue: 'databaseConnectionLimit',
					type: 'text',
					clearable: true,
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'databaseService',
					label: this.$t('table.dataBaseManager.fields.databaseService'),
					tableValue: 'databaseService',
					type: 'select',
					clearable: true,
					filter: false,
					items: this.databaseServices,
					property: ['read', 'edit', 'create', 'search']
				},
				{
					name: 'actions',
					label: this.$t('table.dataBaseManager.fields.actions'),
					tableValue: 'actions',
					sortable: false,
					property: ['read']
				}
			];
		}
	}
};
</script>
