<template>
	<v-form class="pa-6" ref="form" v-model="valid">
		<v-row>
			<v-text-field class="col-12" v-model="item.connectionName" :rules="commonRules" :label="$t('table.dataBaseManager.fields.connectionName')" />
			<v-text-field class="col-12" v-model="item.databaseHost" :rules="urlRules" :label="$t('table.dataBaseManager.fields.databaseHost')" />
			<v-text-field class="col-12" v-model="item.databasePort" :rules="portRules" :label="$t('table.dataBaseManager.fields.databasePort')" />
			<v-text-field class="col-12" v-model="item.databaseUser" :rules="commonRules" :label="$t('table.dataBaseManager.fields.databaseUser')" />
			<v-text-field class="col-12" v-model="item.databasePassword" :rules="commonRules" :label="$t('table.dataBaseManager.fields.databasePassword')" />
			<v-text-field class="col-12" v-model="item.databaseName" :rules="commonRules" :label="$t('table.dataBaseManager.fields.databaseName')" />
			<v-text-field class="col-12" v-model="item.databaseConnectionLimit" :rules="databaseConnectionLimitRules" :label="$t('table.dataBaseManager.fields.databaseConnectionLimit')" />
			<v-select class="col-12" :items="selectLists.databaseService" v-model="item.databaseService" :rules="databaseServiceRules" :label="$t('table.dataBaseManager.fields.databaseService')" />
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
			item: {},
			commonRules: [],
			databaseServiceRules: [],
			portRules: [],
			urlRules: [],
			databaseConnectionLimitRules: []
		};
	},

	methods: {
		submit() {
			this.$emit('submit', this.item);
			this.cancel();
		},
		cancel() {
			this.$emit('close');
		},
		getRules() {
			this.commonRules = [
				(v) => Rules.isRequiredField(v, this.$t('table.dataBaseManager.rulesErrors.required')),
				(v) => Rules.maxNumberOfSymbols(v, this.$t('table.dataBaseManager.rulesErrors.maxNumberOfSymbolsByDefault')),
				(v) => Rules.minNumberOfSymbols(v, this.$t('table.dataBaseManager.rulesErrors.minNumberOfSymbolsByDefault'))
			];
			this.databaseServiceRules = [
				(v) => Rules.isRequiredField(v, this.$t('table.dataBaseManager.rulesErrors.required'))
			];
			this.portRules = [
				(v) => Rules.isRequiredField(v, this.$t('table.dataBaseManager.rulesErrors.required')),
				(v) => Rules.maxNumberOfSymbols(v, this.$t('table.dataBaseManager.rulesErrors.maxNumberOfSymbolsForPort'), 5),
				(v) => Rules.minNumberOfSymbols(v, this.$t('table.dataBaseManager.rulesErrors.minNumberOfSymbolsForPort'), 2),
				(v) => Rules.isOnlyNumbers(v, this.$t('table.dataBaseManager.rulesErrors.onlyNumbers'))
			];
			this.urlRules = [
				(v) => Rules.isRequiredField(v, this.$t('table.dataBaseManager.rulesErrors.required')),
				(v) => Rules.maxNumberOfSymbols(v, this.$t('table.dataBaseManager.rulesErrors.maxNumberOfSymbolsByDefault')),
				(v) => Rules.minNumberOfSymbols(v, this.$t('table.dataBaseManager.rulesErrors.minNumberOfSymbolsByDefault')),
				(v) => Rules.isUrl(v, this.$t('table.dataBaseManager.rulesErrors.urlFormat'))
			]
			this.databaseConnectionLimitRules = [
				(v) => Rules.isRequiredField(v, this.$t('table.dataBaseManager.rulesErrors.required')),
				(v) => Rules.isOnlyNumbers(v, this.$t('table.dataBaseManager.rulesErrors.onlyNumbers'))
			]
		}
	},

	mounted() {
		this.getRules();
		const { active, lastLoginTiem, groupName, userToken, ...userBody } = this.editedField;
		this.item = userBody;
	}
};
</script>
