<template>
  <div class="error-screen">
    <h1>{{ title ?? 'Unknown Error' }}</h1>
    <p>{{ message ?? 'Something went wrong' }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string,
  message: string
}>()
</script>

<style>
.error-screen {
  padding: 2rem;
  font-family: sans-serif;
  color: #b00020;
}
</style>