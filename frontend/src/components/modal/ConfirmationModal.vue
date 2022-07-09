<template>
	<v-app>
		<div class="modal-mask" v-if="isModalShowed">
			<div class="modal-wrapper">
				<div class="modal-container" :style="styleOfModal">
					<v-card-title class="text-h5 title">{{ title }}</v-card-title>
					<v-card-actions>
						<v-spacer />
						<v-row>
							<v-btn class="mr-4" color="red" outlined @click="closeAction()">{{ $t(`table.buttons.cancel`) }}</v-btn>
							<v-btn class="mr-4" color="green" outlined @click="confirmAction()">{{ $t(`table.buttons.ok`) }}</v-btn>
						</v-row>
						<v-spacer />
					</v-card-actions>
				</div>
			</div>
		</div>
	</v-app>
</template>

<script>
export default {
	data() {
		return {
			isModalShowed: true
		};
	},
	props: {
		title: {
			type: String,
			default: () => ''
		}
	},
	methods: {
		closeAction() {
			this.isModalShowed = !this.isModalShowed;
			this.$emit('close');
		},

		confirmAction() {
			this.$options.methods.submit();
			this.closeAction();
		}
	},
	computed: {
		styleOfModal() {
			return `background-color: ${this.$vuetify.theme.dark ? 'black' : 'white'};`;
		}
	}
};
</script>

<style scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
}

.modal-wrapper {
	display: table-cell;
	vertical-align: middle;
}

.modal-container {
	margin: 0px auto;
	padding: 20px 30px;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	max-width: 570px;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.title {
	display: inline;
}
</style>
