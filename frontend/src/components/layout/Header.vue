<template>
	<v-card>
		<v-app-bar flat class="header">
			<v-container>
				<v-row align="center" class="header__left-icons">
					<v-app-bar-nav-icon @click="$emit('click-on-menu')" />

					<!-- <v-btn icon class="mr-2">
						<v-icon>mdi-magnify</v-icon>
					</v-btn>
					<v-text-field :rules="rules" placeholder="Search here" class="header__search" flat solo /> -->
				</v-row>
			</v-container>

			<v-container>
				<v-row align="center" class="header__right-icons">
					<v-btn v-if="!isFullscreen" icon @click="openFullscreen"><v-icon> mdi-fullscreen</v-icon> </v-btn>
					<v-btn v-else icon @click="closeFullscreen"><v-icon> mdi-fullscreen-exit</v-icon> </v-btn>
					<!-- <v-btn icon>
						<svg style="width: 24px; height: 24px; margin: 0 16px" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M10 21H14C14 22.1 13.1 23 12 23S10 22.1 10 21M21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 
								2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19M17 11C17 8.2 14.8 6 12 6S7 8.2 7 11V18H17V11Z"
							/>
						</svg>
					</v-btn>
					<v-btn icon>
						<svg style="width: 24px; height: 24px; margin: 0 16px" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z"
							/>
						</svg>
					</v-btn> -->
					<context-menu />
				</v-row>
			</v-container>
		</v-app-bar>
	</v-card>
</template>

<script>
import { Rules } from '../../shared/rules';

export default {
	components: {
		'context-menu': () => import('@/components/layout/ContextMenu.vue')
	},
	data: () => ({
		isFullscreen: false,
		rules: []
	}),
	created() {
		window.addEventListener('resize', this.handleResize);
	},
	destroyed() {
		window.removeEventListener('resize', this.handleResize);
	},
	methods: {
		handleResize() {
			const fullscreenState = window.innerWidth == screen.width && window.innerHeight == screen.height;
			this.isFullscreen = fullscreenState;
		},
		openFullscreen() {
			const elem = document.body;
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.webkitRequestFullscreen) {
				/* Safari */
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) {
				/* IE11 */
				elem.msRequestFullscreen();
			}
		},
		closeFullscreen() {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				/* Safari */
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				/* IE11 */
				document.msExitFullscreen();
			}
		},
		getRules() {
			this.rules = [(v) => Rules.maxNumberOfSymbols(v, this.$t('header.rulesErrors.maxNumberOfSymbols'))];
		}
	}
};
</script>

<style scoped>
.header {
	width: 100%;
	position: absolute;
	z-index: 99;
}

.header__left-icons {
	display: flex;
	align-items: center;
}

.header__right-icons {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.header__search {
	height: 50px;
}
</style>
