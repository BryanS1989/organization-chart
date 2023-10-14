<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
	<header class="px-8 py-4 bg-blue-700 flex justify-between items-center">
		<h1 class="text-4xl font-bold text-neutral-100">Organization Chart</h1>
		<nav class="flex justify-start items-center gap-12 text-xl">
			<AppLink to="/">Demo</AppLink>
			<AppLink to="https://github.com/BryanS1989">BryanS1989</AppLink>
		</nav>
	</header>

	<RouterView />
</template>

<style scoped></style>
