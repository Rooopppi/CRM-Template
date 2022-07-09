<template>
	<SearchTablePage :component-name="componentName" :fields-list="fieldsList" :table-create-form="formViewCreateGroup" :table-edit-form="formViewEditGroup" />
</template>

<script>
import SearchTablePage from '@/components/generic/search/SearchTablePage';
import FormViewCreateGroup from '@/components/forms/FormViewCreateGroup';
import FormViewEditGroup from '@/components/forms/FormViewEditGroup';

export default {
	name: 'Groups',

	components: {
		SearchTablePage
	},

	watch: {
		'$store.state.locale': function() {
			this.getFieldsList();
		}
	},

	data() {
		return {
			componentName: 'group',
			formViewCreateGroup: FormViewCreateGroup,
			formViewEditGroup: FormViewEditGroup,
			fieldsList: []
		};
	},

	methods: {
		getFieldsList() {
			this.fieldsList = [
				{
					name: 'id',
					label: this.$t('table.group.fields.id'),
					align: 'start',
					sortable: false,
					tableValue: 'id',
					property: ['read']
				},
				{
					name: 'name',
					label: this.$t('table.group.fields.groupName'),
					tableValue: 'name',
					type: 'text',
					align: 'center',
					filter: false,
					property: ['read', 'edit', 'create', 'search']
				},
				{ name: 'actions', label: this.$t('table.group.fields.actions'), tableValue: 'actions', align: 'end', property: ['read'] }
			];
		}
	},
	beforeMount() {
		this.getFieldsList();
	}
};
</script>
