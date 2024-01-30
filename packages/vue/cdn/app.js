const app = Vue.createApp({
  data() {
    return {
      showBooks: true,
      url: "https://www.google.com",
      books: [
        {
          title: 'name of the wind',
          author: 'patrick rothfuss',
          favor: true,
        },
        {
          title: 'the way of kings',
          author: 'brandon sanderson',
          favor: false,
        },
        {
          title: 'the final empire',
          author: 'brandon sanderson',
          favor: true,
        },
      ]
    };
  },
  methods: {
    toggleShowBooks() {
      this.showBooks = !this.showBooks;
    },
    handleEvent(e, data) {
      console.log('event', e, data);
    },
    changeFavor(book) {
      this.books.forEach(b => {
        if (b.title === book.title) {
          b.favor = !b.favor;
        }
      });
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => book.favor);
    }
  }

});

app.mount('#app');