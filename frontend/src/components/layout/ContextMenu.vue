<template>
	<v-badge>
		<v-menu v-for="([text, rounded], index) in btns" :key="text" :rounded="rounded" offset-y min-width="100" :close-on-content-click="false">
			<template v-slot:activator="{ attrs, on }">
				<v-btn icon :color="colors[index]" class="white--text ma-5" v-bind="attrs" v-on="on">
					<v-avatar size="40">
						<v-img src="@/assets/avatar.png" />
					</v-avatar>
				</v-btn>
			</template>

			<v-list>
				<v-list-item class="menu__item">
					<v-switch inset :label="mode" @click="changeTheme" />
				</v-list-item>
				<v-list-group active-class>
					<template v-slot:activator>
						<v-list-item-title> {{ $t('contextMenu.chooseLanguage') }}</v-list-item-title>
					</template>
					<v-list-item active-class v-for="(lang, i) in languages" :key="i" @click="switchLocale(lang.locale)">
						<v-list-item-icon>
							<country-flag :country="lang.iconPath" size="small" />
						</v-list-item-icon>
						<v-list-item-title v-text="lang.label" />
					</v-list-item>
				</v-list-group>
				<v-list-item @click="logout" class="menu__item"> {{ $t('contextMenu.logout') }} </v-list-item>
			</v-list>
		</v-menu>
	</v-badge>
</template>

<script>
import CountryFlag from 'vue-country-flag';

export default {
	name: 'ContextMenu',
	components: {
		CountryFlag
	},
	data: () => ({
		btns: [['Custom', 'b-xl']],
		colors: ['error'],
		languages: []
	}),
	computed: {
		mode() {
			return this.$vuetify.theme.dark ? this.$t('contextMenu.modes.lightMode') : this.$t('contextMenu.modes.darkMode');
		}
	},
	methods: {
		logout() {
			localStorage.removeItem('userToken');
			this.$store.commit('userToken', null);
			this.$router.push({ name: 'login' });
		},
		changeTheme() {
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
			this.$vuetify.theme.options.themeCache.set('isBlackTheme', this.$vuetify.theme.dark);
		},
		switchLocale(locale) {
			this.$i18n.locale = locale;
			this.$store.commit('locale', locale);
		},
		getLanguages() {
			this.languages = [
				{
					locale: 'en',
					label: this.$t('contextMenu.languages.english'),
					iconPath: 'gb'
				},
				{
					locale: 'ua',
					label: this.$t('contextMenu.languages.ukrainian'),
					iconPath: 'ua'
				}
			];
		}
	},

	beforeUpdate() {
		this.getLanguages();
	},

	mounted() {
		this.getLanguages();
	}
};
</script>

<style scoped>
.menu__item {
	display: flex;
	justify-content: center;
}
</style>
