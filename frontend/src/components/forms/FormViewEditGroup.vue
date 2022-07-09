<template>
	<v-form v-model="valid">
		<v-text-field
			v-model="name"
			:error-messages="nameErrors"
			:counter="10"
			:label="$t('table.group.fields.groupName')"
			required
			@input="$v.name.$touch()"
			@blur="$v.name.$touch()"
		/>

		<Permissions class="my-6" @permission="getPermission" :edited-field="editedField" />

		<v-btn :disabled="!valid" class="mr-4" color="green" outlined @click="submit"> {{ $t(`table.buttons.save`) }} </v-btn>
		<v-btn class="mr-4" color="red" outlined @click="cancel"> {{ $t(`table.buttons.cancel`) }} </v-btn>
	</v-form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';

export default {
	name: 'FormGroups',
	props: {
		editedField: {
			type: Object,
			default: () => {}
		}
	},
	components: {
		Permissions: () => import('@/components/permissions/Permissions.vue')
	},
	mixins: [validationMixin],

	validations: {
		name: { required, maxLength: maxLength(10) }
	},

	data: () => ({
		name: '',
		group: {},
		permission: {},
		valid: true
	}),

	computed: {
		nameErrors() {
			const errors = [];
			if (!this.$v.name.$dirty) return errors;
			!this.$v.name.maxLength && errors.push(this.$t('table.user.rulesErrors.maxNumberOfSymbols'));
			!this.$v.name.required && errors.push(this.$t('table.user.rulesErrors.required'));
			return errors;
		}
	},

	methods: {
		submit() {
			this.$v.$touch();
			this.$emit('submit', {
				...this.group,
				name: this.name,
				permissions: this.permission
			});
			this.cancel();
		},
		getPermission(permission) {
			this.permission = {
				...this.permission,
				...permission
			};
		},
		cancel() {
			this.$emit('close');
		}
	},
	mounted() {
		this.group = this.editedField;
		this.name = this.editedField.name;
	}
};
</script>
