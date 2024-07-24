
<template>
  <input type="text">
  <p> You won! </p>
    <p class="green">{{ wordOfTheyDay }}a testaaaaa</p>
</template>


<script setup lang="ts">
defineProps<{
  wordOfTheyDay: string
}>()
</script>