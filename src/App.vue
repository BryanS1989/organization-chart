<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="px-8 py-4 bg-blue-700 flex justify-between items-center">
    <h1 class="text-4xl font-bold text-neutral-100">Organization Chart</h1>
    <nav class="flex justify-start items-center gap-2 text-xl">
        <RouterLink to="/">Demo</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
