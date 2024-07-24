
<template>
  <input maxlength="5" v-model="formattedGuessInProgress" @keydown.enter="guessSubmitted = guessInProgress" type="text">
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheyDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>


<script setup lang="ts">
import { computed, ref } from "vue"
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '@/settings';
import englishWords from "@/englishWordsWith5Letters.json"
defineProps({
  wordOfTheyDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessInProgress = ref("")
const guessSubmitted = ref("")

const formattedGuessInProgress = computed({
  get() {
    return guessInProgress.value
  },
  set(rawValue: string) {
    guessInProgress.value = rawValue.slice(0, 5)
  }
})
</script>