<template>
	<v-main>
		<v-card>
			<v-card-title>
				{{ $t(`table.${componentName}.title`) }}
				<v-spacer />
			</v-card-title>
			<v-data-table
				:headers="headers"
				:items="data"
				:footer-props="{ 'items-per-page-text': $t('table.itemsPerPageText'), 'page-text': $t('table.pageText') }"
				:items-per-page="10"
				class="elevation-1"
				:loading-text="$t('table.loadingText')"
			>
				<template v-slot:top>
					<v-toolbar flat height="auto" class="flex-column">
						<v-row>
							<v-col cols="12">
								<v-list width="100%">
									<v-list-group>
										<template v-slot:activator>
											<v-icon> mdi-filter </v-icon>
											<v-list-item-content>
												<v-list-item-title>{{ $t('table.filters') }}</v-list-item-title>
											</v-list-item-content>
										</template>
										<v-list-item>
											<v-list-item-content>
												<v-row>
													<v-col cols="12" lg="4" v-for="field in textFields" :key="field.name">
														<v-text-field
															v-model="field.value"
															type="text"
															@input="textFieldsFilter($event, field)"
															:clearable="field.clearable"
															:label="field.label"
														/>
													</v-col>
													<v-col cols="12" lg="4" v-for="field in selectFields" :key="field.name">
														<v-select
															:items="field.items"
															@change="selectFieldsFilter($event, field)"
															v-model="field.value"
															:clearable="field.clearable"
															:label="field.label"
														/>
													</v-col>
												</v-row>
											</v-list-item-content>
										</v-list-item>
									</v-list-group>
								</v-list>
							</v-col>
							<v-col cols="12">
								<v-btn color="primary" dark class="mb-2" @click="addField">{{ $t(`table.${componentName}.buttons.newField`) }}</v-btn>
							</v-col>
						</v-row>
					</v-toolbar>
				</template>
				<!-- eslint-disable-next-line -->
				<template v-slot:item.actions="{ item }">
					<v-icon small class="mr-2" @click="editField(item)"> mdi-pencil </v-icon>
					<v-icon small @click="deleteField(item)"> mdi-delete </v-icon>
				</template>
			</v-data-table>
		</v-card>
	</v-main>
</template>

<script>
import visualService from '@/services/visualService.js';
import ApiService from '@/API/apiService.js';

export default {
	name: 'SearchTablePage',

	props: {
		componentName: { type: String, default: () => '' },
		fieldsList: { type: Array, default: () => [] },
		tableCreateForm: { type: Object, default: () => {} },
		tableEditForm: { type: Object, default: () => {} }
	},

	data() {
		return {
			data: [],
			headers: [],
			textFields: [],
			selectFields: [],
			editedField: {},
			selectLists: {}
		};
	},

	async beforeMount() {
		await this.getData();
		this.getTextFields();
		this.getSelectFields();
		this.getHeaders();
	},

	beforeUpdate() {
		this.getHeaders();
		this.getTextFields();
		this.getSelectFields();
	},

	methods: {
		async getData() {
			const response = await ApiService[this.componentName].search();
			this.data = response.data;
			const selectFields = _.filter(this.fieldsList, { type: 'select' });

			_.each(selectFields, (field) => {
				this.getSelectLists(field);
				_.each(this.data, (dataItem) => {
					const filteredFieldArray = _.filter(field.items, { value: dataItem[field.name] });
					const [filteredField] = filteredFieldArray;
					dataItem[field.tableValue] = filteredField.text;
				});
			});
		},

		getSelectLists(field) {
			this.selectLists = { ...this.selectLists, [field.name]: field.items };
		},

		getHeaders() {
			const allowedFields = _.filter(this.fieldsList, ({ property }) => _.includes(property, 'read'));
			this.headers = _.map(allowedFields, (element) => ({ ...element, text: element.label, value: element.tableValue }));
		},

		addField() {
			visualService.createModal({
				title: this.$t(`table.${this.componentName}.formTitles.formCreateTitle`),
				component: this.tableCreateForm,
				width: '800px',
				height: '',
				actions: {
					submit: this.createField.bind(this)
				},
				props: {
					selectLists: this.selectLists,
					editedField: {}
				}
			});
		},

		editField(field) {
			visualService.createModal({
				title: this.$t(`table.${this.componentName}.formTitles.formEditTitle`),
				component: this.tableEditForm,
				width: '800px',
				height: '',
				actions: {
					submit: this.updateField.bind(this)
				},
				props: {
					selectLists: this.selectLists,
					editedField: field
				}
			});
		},

		deleteField(data) {
			this.editedField = { ...data };
			visualService.createConfirmationModal({
				title: this.$t(`table.${this.componentName}.formTitles.formDeleteTitle`),
				actions: {
					submit: this.deleteFieldConfirm.bind(this)
				}
			});
		},

		async deleteFieldConfirm() {
			const response = await ApiService[this.componentName].remove({ id: this.editedField.id });
			if (typeof response.data === 'object') {
				visualService.createToastMessage(this.$t(`table.${this.componentName}.messages.formDeleteMessage`), 'success', 2000);
			}

			this.getData();
		},

		async updateField(data) {
			const response = await ApiService[this.componentName].update(data);
			if (response.success) {
				visualService.createToastMessage(this.$t(`table.${this.componentName}.messages.formEditMessage`), 'success', 2000);
			}
			this.getData();
		},

		async createField(data) {
			const response = await ApiService[this.componentName].create(data);
			if (response.success) {
				visualService.createToastMessage(this.$t(`table.${this.componentName}.messages.formCreateMessage`), 'success', 2000);
			}
			this.getData();
		},

		textFieldsFilter(filterValue, field) {
			const tableField = _.find(this.headers, { value: field.tableValue });
			tableField.filter = (value) => {
				if (!filterValue) return true;
				return _.includes(_.toLower(value), _.toLower(filterValue));
			};
		},

		selectFieldsFilter(filterValue, field) {
			if (!filterValue) return true;
			const tableField = _.find(this.headers, { value: field.tableValue });
			tableField.filter = (value) => {
				const selectedItem = _.find(field.items, { text: value });
				return selectedItem.value === filterValue;
			};
			return true;
		},

		getTextFields() {
			const textFields = _.filter(this.fieldsList, ({ property, type }) => _.includes(property, 'search') && type === 'text');
			this.textFields = _.map(textFields, (element) => ({ ...element, value: '' }));
		},

		getSelectFields() {
			const selectFields = _.filter(this.fieldsList, ({ property, type }) => _.includes(property, 'search') && type === 'select');
			this.selectFields = _.map(selectFields, (element) => ({ ...element, value: '' }));
		}
	}
};
</script>
