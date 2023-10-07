<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex flex-col justify-around items-start gap-2 py-4">
    <h1 class="text-4xl">Organization Chart</h1>
    <nav class="flex justify-around items-center gap-2 text-xl">
        <RouterLink to="/">Demo</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
