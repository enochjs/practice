<template>

  <div class="backdrop"  @click.self="closeModal">
    <div class="modal" :class="{ sale: theme === 'sale' }">
      <h1>Modal Title</h1>
      <p>modal content</p>
      <p>{{ header  }}</p>
      <p>{{  text }}</p>
      <slot></slot> 
      <slot>default content</slot>
      <div class="actions">
        <slot name="links"></slot>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: ['header', 'text', 'theme'],
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>

  <style scoped>
  .modal {
    width: 400px;
    padding: 20px;
    margin: 100px auto;
    background: white;
    border-radius: 10px;
  }
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal.sale {
    background:  crimson;
    color: white;
  }
  .modal.modal.sale h1 {
    color: white ;
  }
</style>