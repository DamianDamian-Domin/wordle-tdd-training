<template>
    
    <GuessView :guess="guessInProgress" />
    <input v-model="guessInProgress"
           :maxlength="WORD_SIZE"
           autofocus
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

const emit = defineEmits<{
  "guess-submitted": [guess: string]
}>()

const guessInProgress = ref("")

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
    emit("guess-submitted", guessInProgress.value)

    guessInProgress.value = ''
}

</script>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}

</style>