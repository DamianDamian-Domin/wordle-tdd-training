<script setup lang="ts">
import WordleBoard from './components/WordleBoard.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <WordleBoard word-of-they-day="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>

</style>./components/WordleBoard.vue
