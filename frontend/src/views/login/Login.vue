<template>
	<v-container fill-height class="content-center pb-16">
		<v-card class="p-10" min-width="300">
			<v-card-title class="justify-center">
				<span class="h4">{{ $t('login.title') }}</span>
			</v-card-title>

			<v-form class="pa-6" ref="form" v-model="valid" lazy-validation>
				<v-text-field v-model="email" :rules="emailRules" :label="$t('login.fields.email')" required />

				<v-text-field v-model="password" :rules="passwordRules" type="password" :label="$t('login.fields.password')" required />

				<v-btn :disabled="!valid" class="col-12" color="primary" @click="handleLogin"> {{ $t('login.buttons.login') }} </v-btn>

				<!-- <v-btn color="success" class="mr-4" > Registration </v-btn> -->
			</v-form>
		</v-card>
	</v-container>
</template>

<script>
import { Rules } from '../../shared/rules.js';
import AuthAPI from '../../API/authAPI.js';
import visualService from '@/services/visualService';

export default {
	name: 'Login',

	components: {},

	data: () => {
		return {
			valid: true,
			email: '',
			password: '',
			emailRules: [],
			passwordRules: []
		};
	},

	methods: {
		async handleLogin() {
			if (!this.$refs.form.validate()) return;

			const isAuthorized = await AuthAPI.login({ email: this.email, password: this.password });
			if (isAuthorized) {
				this.$store.commit('userToken', localStorage.getItem('userToken'));
				this.$router.push({ path: 'admin/users' });
			} else {
				visualService.createToastMessage(this.$t('login.messages.wrongEmailOrPassword'), 'error', 3000);
			}
		},
		logout() {
			localStorage.removeItem('userToken');
		},
		getRules() {
			this.emailRules = [(v) => Rules.isRequiredField(v, this.$t('login.rulesErrors.required')), (v) => Rules.validEmail(v, this.$t('login.rulesErrors.validEmail'))];
			this.passwordRules = [(v) => Rules.isRequiredField(v, this.$t('login.rulesErrors.required'))];
		}
	},

	mounted() {
		this.getRules();
	}
};
</script>

<style scoped>
.content-center {
	display: flex;
	justify-content: center;
}
</style>
