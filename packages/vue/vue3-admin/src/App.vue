<script setup lang="ts">

</script>

<template>
  <header>
    <el-row class="mb-4">
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
    </el-row>

    <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div>
        <div class="text-xl font-medium text-black">ChitChat</div>
        <p class="text-gray-500">You have a new message!</p>
      </div>
    </div>
    <svg-icon name="icon1" color="red" style="height: 100px; width:100px;"></svg-icon>
    <svg-icon name="icon2" color="blue"></svg-icon>
  </header>

</template>
