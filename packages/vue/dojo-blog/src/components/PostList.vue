<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id">
      <!-- <h3>{{  post.title }}</h3> -->
      <SinglePost :post="post" />
    </div>
  </div>
</template>

<script>
  import SinglePost from './SinglePost.vue'
  export default {
    props: ['posts'],
    components: {
      SinglePost,
    },
    setup(props) {
      console.log('======>>1234', props.posts[0].id);
    }
  }
</script>

<style scoped>

</style>