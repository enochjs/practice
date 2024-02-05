<template>
  <div v-if="error">{{  error }}</div>
  <div v-if="post">
    <h1>{{ post.title }}</h1>
    <p>{{ post.body }}</p>
    <span v-for="tag in post.tags" :key="tag">
      #{{ tag }}
    </span>
  </div>
</template>

<script>

  import getPost from "../composables/getPost";

  export default {
    props: ['id'] ,
    setup(props) {
      console.log('======>>1234', props.id);
      const {post, error, load } = getPost(props.id);
      load();
      return {
        post,
        error,
      }
    }
  }
</script>

<style scoped>

</style>