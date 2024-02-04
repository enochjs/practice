<template>
  <h1>Jobs</h1>
  <div v-for="job in jobs" :key="job.id" @click="">
    
    <router-link :to="{name: 'JobDetails', params: { id: job.id }}">
      {{ job.title }}
    </router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        jobs: []
      }
    },
    mounted() {
      console.log('jobs mounted')
      fetch('http://localhost:3000/jobs')
        .then(resp => resp.json())
        .then(resp => {
          this.jobs = resp
        })
    }
  }
</script>

<style scoped>

</style>