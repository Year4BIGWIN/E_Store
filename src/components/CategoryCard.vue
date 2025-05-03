<template>
  <div 
    @click="$emit('select', title.toLowerCase())"
    class="group relative overflow-hidden bg-white hover:bg-blue-50 w-[270px] px-6 py-5 flex items-center gap-4 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
  >
    <!-- Left border indicator for selected state -->
    <div 
      class="absolute left-0 top-0 h-full w-1 bg-blue-600 transform transition-transform duration-300"
      :class="isSelected ? 'scale-y-100' : 'scale-y-0'"
    ></div>
    
    <!-- Icon container -->
    <div class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-300 shrink-0 group-hover:bg-blue-500/10">
      <!-- Font Awesome icon (if provided) -->
      <i v-if="icon" :class="[icon, 'text-blue-600']"></i>
      
      <!-- SVG icon (if provided) -->
      <span 
        v-else-if="svg" 
        v-html="svg" 
        class="text-blue-600"
      ></span>
    </div>
    
    <!-- Content -->
    <div class="flex flex-col gap-1">
      <h1 class="text-xl font-medium">{{ title }}</h1>
      <span class="text-sm flex items-center gap-1 text-blue-600 opacity-80 transition-all duration-300 group-hover:opacity-100">
        view all 
        <i class="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
      </span>
    </div>
    
    <!-- Background decoration element (optional) -->
    <div class="absolute right-0 bottom-0 w-20 h-20 opacity-5 transform translate-x-6 translate-y-6 rotate-12 text-blue-900">
      <!-- Use same icon for background decoration -->
      <i v-if="icon" :class="[icon, 'text-4xl']"></i>
      <span v-else-if="svg" v-html="svg"></span>
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
    default: null
  },
  svg: {
    type: String,
    default: null
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select']);
</script>