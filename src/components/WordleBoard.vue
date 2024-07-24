
<template>
  <input type="text">
  <p> {{ VICTORY_MESSAGE }} </p>
  <p class="green">Better luck next time!</p>
</template>


<script setup lang="ts">
import { VICTORY_MESSAGE } from '@/settings';
defineProps<{
  wordOfTheyDay: string
}>()
</script>