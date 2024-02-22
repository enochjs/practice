<template>
  <svg aria-hidden="true" :style="style">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
  import {  computed } from 'vue'
  const props = defineProps({
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#333',
    },
    style: {
      type: Object,
      default: () => ({
        width: '30px',
        height: '30px',
      }),
    },
  })

  const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>