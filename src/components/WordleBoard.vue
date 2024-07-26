As others are pointing new computed behavior doesn't allow to pass the test. This is my solution with validation with on
input.

<template>
  <GuessInput @guess-submitted="guess => guessSubmitted = guess"></GuessInput>
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheyDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>


<script setup lang="ts">
import { computed, ref } from "vue"
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '@/settings';
import englishWords from "@/englishWordsWith5Letters.json"
import GuessInput from "@/components/GuessInput.vue"

defineProps({
  wordOfTheyDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const emit = defineEmits<{
  "guess-submitted": [guess: string]
}>()

const guessSubmitted = ref("")


</script>