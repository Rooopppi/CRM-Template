<template>
	<section class="pt-16 virtual-scroll-table">
		<v-container>
			<router-view />
		</v-container>
	</section>
</template>

<style scoped>
.virtual-scroll-table {
	max-height: 100vh;
	overflow: auto;
}
</style>
