<template>
  <div 
    @click="$emit('select', title.toLowerCase())"
    class="group bg-[#d9d9d9] hover:bg-blue-500 hover:text-white hover:fill-white w-[270px] px-4 py-4 flex items-center rounded-xl cursor-pointer"
    :class="{'bg-blue-500 text-white': isSelected}"
  >
    <i :class="icon"></i>
    <hr class="w-10 border border-black group-hover:border-white rotate-90">
    <div>
      <h1 class="text-xl">{{ title }}</h1>
      <span>view all <i class="fa-solid fa-angles-right"></i></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select']);
</script>