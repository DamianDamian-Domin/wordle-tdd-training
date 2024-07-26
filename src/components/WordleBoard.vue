As others are pointing new computed behavior doesn't allow to pass the test. This is my solution with validation with on
input.

<template>
  <input :maxlength="WORD_SIZE" v-model="guessInProgress" @input="onInput" @keydown.enter="onSubmit" type="text">
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheyDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>


<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '@/settings';
import englishWords from "@/englishWordsWith5Letters.json"
defineProps({
  wordOfTheyDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessInProgress = ref("")
const guessSubmitted = ref("")

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = target.value
  guessInProgress.value = value
    .slice(0, WORD_SIZE)
    .toUpperCase()
    .replace(/[^A-Z]+/gi, "")
}

function onSubmit() {
  if (!englishWords.includes(guessInProgress.value)) {
    return
  }
  guessSubmitted.value = guessInProgress.value
}

</script>