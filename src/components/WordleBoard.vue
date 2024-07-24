
<template>
  <input type="text">
  <p class="green">{{ wordOfTheyDay }}</p>
  <p> {{ VICTORY_MESSAGE }} </p>
</template>


<script setup lang="ts">
import { VICTORY_MESSAGE } from '@/settings';
defineProps<{
  wordOfTheyDay: string
}>()
</script>