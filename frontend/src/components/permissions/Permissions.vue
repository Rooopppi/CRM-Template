<template>
	<v-card>
		<v-card-title class="text-h6 title"> {{ $t('permissions.title') }} </v-card-title>
		<v-row class="pa-4" justify="space-between">
			<v-col>
				<v-card class="pt-6 mx-auto" flat max-width="400">
					<v-list-item v-for="(section, sectionsIndex) in sections" :key="sectionsIndex">
						<template>
							<v-list-item-content>
								<v-list-item>
									<v-checkbox
										@click="onClickOnSectionsCheckbox(section, sectionsIndex)"
										:input-value="section.checked"
										:indeterminate="section.isIndeterminate"
									/>
									<v-list-item-title>{{ section.label }}</v-list-item-title>
								</v-list-item>
								<v-list>
									<v-list-item-group mandatory color="indigo">
										<v-list-item
											v-for="(component, componentsIndex) in getSectionsComponents(section.name)"
											:key="componentsIndex"
											@click="onClickOnComponent(componentsIndex, sectionsIndex)"
											class="components__item"
										>
											<v-list-item-title class="ml-12">
												{{ component.label }}
											</v-list-item-title>
											<v-checkbox
												@click="onClickOnComponentsCheckbox(component, section, componentsIndex, sectionsIndex)"
												:input-value="component.checked"
												:indeterminate="isIndeterminateState(component, componentsIndex)"
											/>
										</v-list-item>
									</v-list-item-group>
								</v-list>
							</v-list-item-content>
						</template>
					</v-list-item>
				</v-card>
			</v-col>

			<v-divider vertical />

			<v-col class="d-flex text-center">
				<v-scroll-y-transition mode="out-in">
					<div v-if="!selected" class="text-h6 font-weight-light" style="align-self: center">
						{{ $t('permissions.selectPermission') }}
					</div>
					<v-card v-else :key="selected.id" class="pt-16 mx-auto permissions" flat>
						<v-list-item v-for="(permission, index) in selected" :key="index">
							<template>
								<v-list-item-action>
									<v-checkbox :input-value="permission.checked" color="primary" @click="onClickOnPermissionsCheckbox(index)" :label="permission.label" />
								</v-list-item-action>
							</template>
						</v-list-item>
					</v-card>
				</v-scroll-y-transition>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import _ from 'lodash';
import ApiService from '@/API/apiService.js';

export default {
	props: {
		editedField: {
			type: Object,
			default: () => {}
		}
	},
	data: () => ({
		isCheckboxDisabled: false,
		components: [],
		permissions: [],
		sections: [],
		currentComponent: {},
		currentSection: {},
		permissionsOfComponents: {},
		initState: {}
	}),
	computed: {
		selected() {
			if (_.isEmpty(this.currentComponent)) return undefined;
			return this.permissions;
		},
		disabled() {
			return this.isCheckboxDisabled;
		}
	},
	methods: {
		onClickOnSectionsCheckbox(section, sectionsIndex) {
			section.isIndeterminate = false;
			section.checked = !section.checked;
			this.currentSection = { ...section, index: sectionsIndex };
			const components = this.getSectionsComponents(section.name);
			const currentSettings = {
				currentPermissions: this.permissions,
				currentComponent: this.currentComponent
			};
			this.changeStateEachComponent(components, section);
			this.restoreCurrentSettings(currentSettings, section.checked);
			this.sections = this.getParentArrayWithChangedStates(this.currentSection, this.sections, this.components);
		},

		changeStateEachComponent(components, section) {
			_.forEach(components, (component, index) => {
				component.checked = !section.checked;
				this.currentComponent = { ...component, index: index };
				this.permissions = this.getPermissions();
				this.changeStates(component);
			});
		},

		restoreCurrentSettings(settings, checked) {
			this.permissions = this.getObjectsWithFieldOfGivenValue(settings.currentPermissions, 'checked', checked);
			this.currentComponent = settings.currentComponent;
		},

		changeStatesOfSection(section) {
			this.sections = this.getParentArrayWithChangedStates(this.currentSection, this.sections, this.components);
			this.changeIndeterminateStateForSection(section);
		},

		onClickOnComponentsCheckbox(component, section, componentsIndex, sectionsIndex) {
			this.currentComponent = { ...component, index: componentsIndex };
			this.permissions = this.getPermissions();
			this.changeStates(component, componentsIndex);
			this.currentSection = this.getActiveItem(sectionsIndex, this.sections);
			this.changeStatesOfSection(section);
		},

		onClickOnPermissionsCheckbox(index) {
			this.sendComponentWithCheckedPermissions(index);
			this.components = this.getParentArrayWithChangedStates(this.currentComponent, this.components, this.permissions);
			this.changeIndeterminateStateForSection(this.currentSection);
		},

		onClickOnComponent(indexOfCurrentComponent, sectionsIndex) {
			this.currentComponent = this.getActiveItem(indexOfCurrentComponent, this.components);
			this.permissions = this.getPermissions();
			this.permissions = this.getObjectsWithFieldOfGivenValue(this.permissions, 'checked', false);
			this.applyCurrentStatesOfPermissionsAfterSwitchingComponents();
			this.components = this.getParentArrayWithChangedStates(this.currentComponent, this.components, this.permissions);
			this.currentSection = this.getActiveItem(sectionsIndex, this.sections);
		},

		changeStates(component, index) {
			this.permissions = this.getObjectsWithFieldOfGivenValue(this.permissions, 'checked', component.checked);
			component.checked = !component.checked;
			this.components[index] = component;
			_.forEach(this.permissions, (_, index) => this.sendComponentWithCheckedPermissions(index));
		},

		sendComponentWithCheckedPermissions(indexOfPermission) {
			const componentWithCheckedPermissions = this.createComponentWithCheckedPermissions(indexOfPermission);
			this.$emit('permission', componentWithCheckedPermissions);
			this.permissionsOfComponents = {
				...this.permissionsOfComponents,
				...componentWithCheckedPermissions
			};
		},

		getParentArrayWithChangedStates(currentItem, parentArray, childArray) {
			const parent = this.getParentItemWithChangedStates(parentArray[currentItem.index], childArray);
			parentArray[currentItem.index] = parent;
			return parentArray;
		},

		getParentItemWithChangedStates(parent, child) {
			if (_.every(child, (item) => item.checked)) {
				parent.checked = true;
				parent.isIndeterminate = false;
				return parent;
			}

			if (_.every(child, (item) => !item.checked && !item.isIndeterminate)) {
				parent.checked = false;
				parent.isIndeterminate = false;
				return parent;
			}
			parent.checked = false;
			parent.isIndeterminate = true;
			return parent;
		},

		createComponentWithCheckedPermissions(indexOfPermission) {
			const checkedPermissions = this.getCheckedPermissions(indexOfPermission);

			return {
				[_.lowerFirst(this.currentComponent.name)]: checkedPermissions
			};
		},

		getCheckedPermissions(index) {
			this.permissions[index].checked = !this.permissions[index].checked;
			const filteredPermissions = _.filter(this.permissions, (permission) => permission.checked);
			return _.map(filteredPermissions, (permission) => _.lowerFirst(permission.name));
		},

		isIndeterminateState(component, index) {
			component.isIndeterminate = !this.isEmptyPermissionsOfComponents(component.name) && this.isAmountOfPermissionsLessThanAllAmount(component.name);
			this.components[index] = component;
			return this.components[index].isIndeterminate;
		},

		changeIndeterminateStateForSection(section) {
			const filteredComponents = this.getSectionsComponents(section.name);
			const sectionWithChangedStates = this.getParentItemWithChangedStates(section, filteredComponents);
			const index = this.getIndex(sectionWithChangedStates.id, this.sections);
			this.sections[index] = sectionWithChangedStates;
			this.currentSection = sectionWithChangedStates;
		},

		isEmptyPermissionsOfComponents(componentsName) {
			return _.isEmpty(this.permissionsOfComponents) || !Object.prototype.hasOwnProperty.call(this.permissionsOfComponents, _.lowerFirst(componentsName));
		},

		isAmountOfPermissionsLessThanAllAmount(componentsName) {
			const currentAmountOfComponentsPermissions = this.permissionsOfComponents[_.lowerFirst(componentsName)].length;
			const transformedNameOfComponent = _.lowerFirst(componentsName);
			const initAmountOfComponentsPermissions = this.initState[transformedNameOfComponent][0].length;
			return !!currentAmountOfComponentsPermissions && currentAmountOfComponentsPermissions < initAmountOfComponentsPermissions;
		},

		setDefaultStatesOfComponents() {
			this.components = this.getObjectsWithFieldOfGivenValue(this.components, 'selected', false);
		},

		getActiveItem(indexOfCurrentComponent, array) {
			array[indexOfCurrentComponent].selected = true;
			return {
				...array[indexOfCurrentComponent],
				index: indexOfCurrentComponent
			};
		},

		applyCurrentStatesOfPermissionsAfterSwitchingComponents() {
			this.permissions = this.getPermissions();
			_.forEach(this.permissionsOfComponents[_.lowerFirst(this.currentComponent.name)], (permissionOfComponent) => {
				const foundIndex = _.findIndex(this.permissions, (permission) => _.toLower(permission.name) === _.toLower(permissionOfComponent));
				this.permissions[foundIndex].checked = true;
			});
		},

		getObjectsWithFieldOfGivenValue(items, field, value) {
			const uncheckedPermissions = _.map(items, (item) => ({
				...item,
				[field]: value
			}));
			return [...uncheckedPermissions];
		},

		getIndex(id, array) {
			return _.findIndex(array, (item) => item.id === id);
		},

		getSectionsComponents(section) {
			return _.filter(this.components, (component) => component.section === section);
		},

		setInitCheckboxesStates() {
			this.setInitCheckboxesStatesForComponents();
			this.setInitCheckboxesStatesForSections();
		},

		setInitCheckboxesStatesForComponents() {
			_.forEach(this.components, (_, index) => {
				this.currentComponent = this.getActiveItem(index, this.components);
				this.permissions = this.getObjectsWithFieldOfGivenValue(this.permissions, 'checked', false);
				this.applyCurrentStatesOfPermissionsAfterSwitchingComponents();
				this.components = this.getParentArrayWithChangedStates(this.currentComponent, this.components, this.permissions);
			});
			this.currentComponent = {};
		},

		setInitCheckboxesStatesForSections() {
			_.forEach(this.sections, (section, index) => {
				this.currentSection = this.getActiveItem(index, this.sections);
				this.changeStatesOfSection(section);
			});
			this.currentSection = {};
		},

		async createInitComponentsState() {
			const response = await ApiService.group.getAllComponentsPermissions();
			this.initState = response.data;
			for (const component in this.initState) {
				const title = _.upperFirst(component);
				this.components.push({
					name: title,
					label: title,
					section: 'Admin',
					checked: false,
					selected: false,
					isIndeterminate: false
				});
			}
		},

		getPermissions() {
			const key = _.lowerFirst(this.currentComponent.name);
			const permissions = this.initState[key][0];
			return _.map(permissions, (permission) => {
				const title = _.upperFirst(permission);
				return {
					name: title,
					label: title,
					checked: false
				};
			});
		}
	},
	async beforeMount() {
		await this.createInitComponentsState();

		this.sections = [
			{
				name: 'Admin',
				label: this.$t('permissions.sections.admin'),
				checked: false,
				selected: false,
				isIndeterminate: false
			}
		];

		if (!Object.prototype.hasOwnProperty.call(this.editedField, 'permissions')) {
			return;
		}

		for (const permission in this.editedField.permissions) {
			this.permissionsOfComponents[permission] = this.editedField.permissions[permission];
			this.$emit('permission', {
				[permission]: this.editedField.permissions[permission]
			});
		}

		this.setInitCheckboxesStates();
	}
};
</script>

<style scoped>
.components__item {
	height: 50px;
}

.component__icon {
	position: absolute;
}

.title {
	border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.permissions {
	max-width: 400px;
	width: 100%;
}
</style>
