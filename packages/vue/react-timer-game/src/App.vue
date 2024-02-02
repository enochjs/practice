<template>
  <h1>Ninja Reaction Timer</h1>
  <button @click="start" :disabled="isPlaying">play</button>
  <Block v-if="isPlaying" :delay="delay" @end="endGame" />
  <Results  v-if="showResults" :score="score" />
</template>


<script>
import Block from './components/Block.vue'
import Results from './components/Results.vue';
export default {
  name: 'App',
  components: {
    Block,
    Results,
  },
  data() {
    return {
      isPlaying: false,
      delay: null,
      score: null,
      showResults: false,
    }
  },
  methods: {
    start() {
      this.delay = 2000 + Math.random() * 5000;
      this.isPlaying = true;
      this.showResults = false
    },
    endGame(reactionTime) {
      this.score = reactionTime
      this.isPlaying = false;
      this.showResults = true;
      console.log(reactionTime)
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  font-weight: normal;
  text-align: center;
  color: #444;
  margin-top: 120px;
}

</style>
