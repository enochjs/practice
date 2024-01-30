
<template>
  <h1>{{ msg }}</h1>
  <input type="text" ref="name">
  <button @click="handleClick">click me</button>
  <Modal />
</template>


<script>
import Modal from './components/Modal.vue'
export default {
  name: 'App',
  components: {
    Modal,
    Modal
},
  data() {
    return {
      msg: 'My First Vue 3 App'
    }
  },
  methods: {
    handleClick() {
      console.log(this.$refs.name.value)
      this.$refs.name.classList.add('red1')
      this.$refs.name.focus()
    }
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
