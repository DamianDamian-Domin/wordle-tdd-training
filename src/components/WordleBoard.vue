<template>
  <main>

    <ul>
      <li v-for="(guess, index) in guessesSubmitted" :key="`${guess}-${index}`">
        <GuessView :guess="guess" :answer="wordOfTheDay" />
      </li>
      <li v-for="index in guessesLeft" :key="`${index}`">
        <GuessView guess="" />
      </li>
    </ul>

    <guess-input :is-game-over="isGameOver" @guess-submitted="guess => guessesSubmitted.push(guess)"/>

    <p v-if="isGameOver"
       class="end-of-game-message"
       v-text="guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE" />
  </main>
</template>



<script setup lang="ts">
import { computed, ref } from "vue"
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE, MAX_GUESSES_COUNT } from '@/settings';
import englishWords from "@/englishWordsWith5Letters.json"
import GuessInput from "@/components/GuessInput.vue"
import GuessView from "@/components/GuessView.vue"

const props = defineProps({
  wordOfTheDay: {
    type: String,
    required: true,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const emit = defineEmits<{
  "guess-submitted": [guess: string]
}>()

const guessesSubmitted = ref<string[]>([])

const isGameOver = computed(() => guessesSubmitted.value.length === MAX_GUESSES_COUNT || guessesSubmitted.value.includes(props.wordOfTheDay))

const guessesLeft = computed(() => MAX_GUESSES_COUNT - guessesSubmitted.value.length)

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

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 0.25rem;
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