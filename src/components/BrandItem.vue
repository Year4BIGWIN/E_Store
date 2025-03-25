<template>
  <div class="w-full flex justify-between p-2">
    <div class="flex gap-4 items-center">
      <div class="w-20 h-20 bg-slate-300 rounded-xl">
        <img
          :src="brand.image_url"
          alt="..."
          class="w-full h-full object-cover rounded-xl"
        />
      </div>
      <h1>Title</h1>
    </div>
    <div class="flex gap-2 items-center">
      <button class="bg-blue-500 text-white px-2 py-1 rounded-lg">Edit</button>
      <button class="bg-red-500 text-white px-2 py-1 rounded-lg">Delete</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  brand: {
    type: Object,
    required: true,
  },
});

console.log(props.brand);
</script>
