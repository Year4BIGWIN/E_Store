<template>
  <div class="dropdown-container bg-white rounded-lg border border-gray-200 overflow-hidden">
    <button 
      @click="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.enter.prevent="toggleDropdown"
      :aria-expanded="isOpen"
      :aria-controls="dropdownId"
      class="w-full flex justify-between items-center p-4 font-medium text-gray-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-sm transition-colors">
      <div class="flex items-center gap-3">
        <span v-if="icon" class="text-blue-600">
          <i :class="icon"></i>
        </span>
        <span class="text-lg">{{ title }}</span>
      </div>
      <div 
        class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 transition-all duration-300"
        :class="{'bg-blue-100': isOpen}">
        <span 
          :class="isOpen ? 'rotate-180 text-blue-600' : 'rotate-0 text-gray-600'" 
          class="transition-transform duration-300 ease-in-out text-sm">
          <i class="fa-solid fa-chevron-down"></i>
        </span>
      </div>
    </button>
    <div 
      v-show="isOpen"
      :id="dropdownId"
      class="dropdown-content overflow-hidden transition-all duration-300 ease-in-out"
      :class="{'max-h-0 opacity-0': !isOpen, 'max-h-[500px] opacity-100': isOpen}">
      <div class="p-4 bg-white border-t border-gray-100">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  defaultOpen: {
    type: Boolean,
    default: false
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['toggle']);
const isOpen = ref(props.defaultOpen);
const dropdownId = ref(`dropdown-${Math.random().toString(36).substring(2, 9)}`);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  emit('toggle', isOpen.value);
};

const closeDropdown = (event) => {
  if (!props.closeOnClickOutside) return;
  
  const container = event.target.closest('.dropdown-container');
  if (!container) {
    isOpen.value = false;
    emit('toggle', false);
  }
};

onMounted(() => {
  if (props.closeOnClickOutside) {
    document.addEventListener('click', closeDropdown);
  }
});

onUnmounted(() => {
  if (props.closeOnClickOutside) {
    document.removeEventListener('click', closeDropdown);
  }
});
</script>

<style scoped>
.dropdown-content {
  transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
}

.dropdown-container {
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s ease;
}

.dropdown-container:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
</style>
