
<template>
  <input v-model="guessInProgress" @keydown.enter="guessSubmitted = guessInProgress" type="text">
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheyDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>


<script setup lang="ts">
import { ref } from "vue"
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings';
defineProps({
  wordOfTheyDay: {
    type: String,
    validator: (wordGiven: string) => wordGiven.length === 5 && wordGiven.toLocaleUpperCase() === wordGiven
  }
})

const guessInProgress = ref("")
const guessSubmitted = ref("")
</script>