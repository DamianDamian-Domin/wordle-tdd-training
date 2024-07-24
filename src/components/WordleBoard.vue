
<template>
  <input type="text">
  <p> {{ VICTORY_MESSAGE }} </p>
  <p>{{ DEFEAT_MESSAGE }}</p>
</template>


<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings';
defineProps<{
  wordOfTheyDay: string
}>()
</script>