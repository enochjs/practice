

<template>
  
  <div v-if="job">
    <h1>{{ job.title }}</h1>
    <p>The Job id is {{ id }}</p>
    <p>{{  job.details }}</p>
  </div>
</template>

<script>
  export default {
    props: ['id'],
    data() {
      return {
        job: null
      }
    },
    mounted() {
      fetch(`http://localhost:3000/jobs/${this.id}`)
        .then(resp => resp.json())
        .then(resp => {
          console.log(resp)
          this.job = resp
        }).catch(e => {
          console.log(e)
        })
    }
  }
</script>

<style scoped>

</style>