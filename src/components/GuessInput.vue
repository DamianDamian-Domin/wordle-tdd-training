<template>
    
    <GuessView :guess="guessInProgress" :class="{shake: hasFailedValidation}" />
    <input v-model="guessInProgress"
           :maxlength="WORD_SIZE"
           :disabled="isGameOver"
           autofocus
           aria-label="Make your guess for the word of the day!"
           @blur="({target}) => (target as HTMLInputElement).focus()"
           type="text"
            @input="onInput"
           @keydown.enter="onSubmit">
  </template>

<script setup lang="ts">
import { ref } from "vue"
import { WORD_SIZE } from '@/settings';
import englishWords from "@/englishWordsWith5Letters.json"
import GuessView from "@/components/GuessView.vue"

defineProps({
  isGameOver: {
    required: true,
    type: Boolean
  }
})

const emit = defineEmits<{
  "guess-submitted": [guess: string]
}>()

const guessInProgress = ref("")
const hasFailedValidation = ref<boolean>(false)

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
        hasFailedValidation.value = true
        setTimeout(() => hasFailedValidation.value = false, 500)
        return
    }
    emit("guess-submitted", guessInProgress.value)

    guessInProgress.value = ''
}

</script>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}

.shake {
  animation: shake;
  animation-duration: 100ms;
  animation-iteration-count: 2;
}

@keyframes shake {
  0% {
    transform: translateX(-2%);
  }

  25% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(2%);
  }

  75% {
    transform: translateX(0);
  }
}
</style>