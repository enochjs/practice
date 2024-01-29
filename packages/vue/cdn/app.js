console.log('hello, vue');

const app = Vue.createApp({
  data() {
    return {
      showBooks: true,
      title: 'The VueJS Instance',
      author: 'Max',
      age: 27
    };
  },
  methods: {
    toggleShowBooks() {
      this.showBooks = !this.showBooks;
    }
  },

});

app.mount('#app');