<template>
  <main>
    <guess-input @guess-submitted="guess => guessesSubmitted.push(guess)"/>

    <p v-if="guessesSubmitted.length === 6 || guessesSubmitted.includes(wordOfTheyDay)"
       class="end-of-game-message"
       v-text="guessesSubmitted.includes(wordOfTheyDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE" />
  </main>
</template>



<script setup lang="ts">
import { computed, ref } from "vue"
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '@/settings';
import englishWords from "@/englishWordsWith5Letters.json"
import GuessInput from "@/components/GuessInput.vue"

defineProps({
  wordOfTheyDay: {
    type: String,
    required: true,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const emit = defineEmits<{
  "guess-submitted": [guess: string]
}>()

const guessesSubmitted = ref<string[]>([])


</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

.end-of-game-message {
  font-size: 3rem;
  animation: end-of-game-message-animation 700ms forwards;
  white-space: nowrap;
  text-align: center;
}

@keyframes end-of-game-message-animation {
  0% {
    opacity: 0;
    transform: rotateZ(0);
  }
  100% {
    opacity: 1;
    transform: translateY(2rem);
  }
}
</style>