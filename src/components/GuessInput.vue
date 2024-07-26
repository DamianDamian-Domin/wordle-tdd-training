As others are pointing new computed behavior doesn't allow to pass the test. This is my solution with validation with on
input.

<template>
  <input :maxlength="WORD_SIZE" v-model="guessInProgress" @input="onInput" @keydown.enter="onSubmit" type="text">
</template>


<script setup lang="ts">
import { ref } from "vue"
import { WORD_SIZE } from '@/settings';
import englishWords from "@/englishWordsWith5Letters.json"

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
}

emit("guess-submitted", guessInProgress.value)

</script>