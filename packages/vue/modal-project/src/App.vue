
<template>
  <h1>{{ msg }}</h1>
  <input type="text" ref="name">
  <button @click="handleClick">click me</button>
  <br>
  <br>
  <br>
  <Teleport to=".modals"  v-if="showModal">
    <Modal :header="header" :text="text" theme="sale" @close="toggleModal">
      <p>this is slot children</p>
      <template v-slot:links>
        <p>this is a name slot</p>
      </template>
    </Modal>
  </Teleport>
  <button @click.alt="toggleModal">open Modal (alt)</button>

  <div v-if="showModalTwo">
    <Modal :header="header" :text="text" @close="toggleModalTwo">
      <p>this is another slot children</p>
      <template v-slot:links>
        <p>this is another name slot</p>
      </template>
    </Modal>
  </div>

  <button @click="toggleModalTwo">open Modal two</button>


</template>


<script>
import { Teleport } from 'vue'
import Modal from './components/Modal.vue'
export default {
  name: 'App',
  components: {
    Modal,
    Teleport
},
  data() {
    return {
      msg: 'My First Vue 3 App',
      header: 'Sign up for the Gateway',
      text: ['text', 'array'],
      showModal: false,
      showModalTwo: false,
    }
  },
  methods: {
    handleClick() {
      console.log(this.$refs.name.value)
      this.$refs.name.classList.add('red1')
      this.$refs.name.focus()
    },
    toggleModal() {
      this.showModal = !this.showModal
    },
    toggleModalTwo() {
      this.showModalTwo = !this.showModalTwo
    },
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
