<template>
	<v-form class="pa-6" ref="form" v-model="valid">
		<v-row>
			<v-text-field class="col-12" v-model="user.userName" :rules="commonRules" :label="$t('table.user.fields.userName')" required />
			<v-text-field class="col-12" v-model="user.email" :rules="emailRules" :label="$t('table.user.fields.email')" required />
			<v-text-field class="col-12" v-model="user.password" :rules="commonRules" type="password" :label="$t('table.user.fields.password')" required />
			<v-select class="col-12" :items="selectLists.group" v-model="user.group" :rules="groupRules" :label="$t('table.user.fields.groupName')" required />
			<v-btn :disabled="!valid" class="mr-4" color="green" outlined @click="submit"> {{ $t(`table.buttons.create`) }} </v-btn>
			<v-btn class="mr-4" color="red" outlined @click="cancel"> {{ $t(`table.buttons.cancel`) }} </v-btn>
		</v-row>
	</v-form>
</template>

<script>
import { Rules } from '@/shared/rules';

export default {
	name: 'FormViewCreateUser',

	props: {
		editedField: { type: Object, default: () => {} },
		selectLists: { type: Object, default: () => {} },
		componentName: { type: String, default: () => '' }
	},

	data: () => {
		return {
			valid: true,
			user: {},
			emailRules: [],
			commonRules: [],
			groupRules: []
		};
	},

	methods: {
		submit() {
			this.$emit('submit', this.user);
			this.cancel();
		},
		cancel() {
			this.$emit('close');
		},
		getRules() {
			this.emailRules = [
				(v) => Rules.isRequiredField(v, this.$t('table.user.rulesErrors.required')),
				(v) => Rules.validEmail(v, this.$t('table.user.rulesErrors.validEmail'))
			];
			this.commonRules = [
				(v) => Rules.isRequiredField(v, this.$t('table.user.rulesErrors.required')),
				(v) => Rules.maxNumberOfSymbols(v, this.$t('table.user.rulesErrors.maxNumberOfSymbols')),
				(v) => Rules.minNumberOfSymbols(v, this.$t('table.user.rulesErrors.minNumberOfSymbols'))
			];
			this.groupRules = [(v) => Rules.isRequiredField(v, this.$t('table.user.rulesErrors.required'))];
		}
	},

	mounted() {
		this.getRules();
		const { active, lastLoginTiem, groupName, userToken, ...userBody } = this.editedField;
		this.user = userBody;
	}
};
</script>
