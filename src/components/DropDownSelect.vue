<template>
  <div class="relative">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    
    <!-- Custom dropdown trigger -->
    <div 
      class="border border-gray-300 rounded-md px-3 py-2 bg-white flex justify-between items-center"
      :class="[disabled ? 'cursor-not-allowed opacity-70 bg-gray-50' : 'cursor-pointer']"
      @click="!disabled && toggleDropdown()"
    >
      <span :class="[
        selectedOption ? '' : 'text-gray-500',
        disabled ? 'text-gray-400' : ''
      ]">
        {{ selectedOption ? selectedOption.label : `Select ${label}` }}
      </span>
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
    
    <!-- Dropdown container -->
    <div 
      v-if="isOpen" 
      :id="props.id + '-dropdown'" 
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <!-- Search input inside dropdown -->
      <div v-if="searchable" class="sticky top-0 p-2 border-b bg-white">
        <input
          ref="searchInput"
          type="text"
          :placeholder="`Search ${label.toLowerCase()}...`"
          v-model="searchQuery"
          @click.stop
          class="w-full p-2 border border-gray-300 rounded"
          autocomplete="off"
        />
      </div>
      
      <!-- Options list -->
      <div class="py-1">
        <div 
          v-for="option in filteredOptions" 
          :key="option.value" 
          @click="selectOption(option)"
          class="px-4 py-2 cursor-pointer hover:bg-blue-100"
          :class="{'bg-blue-50': option.value === selectedValue}"
        >
          {{ option.label }}
        </div>
        
        <div v-if="filteredOptions.length === 0" class="px-4 py-2 text-gray-500 italic">
          No options found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  id: String,
  label: String,
  options: Array,
  selectedValue: String,
  searchable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false } // Add disabled prop
});

const emit = defineEmits(['update:selectedValue']);

const isOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref(null);

// Find the currently selected option for display
const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.selectedValue);
});

// Toggle dropdown considering disabled state
function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
}

// Filter options based on search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  
  return props.options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Select an option and close dropdown
function selectOption(option) {
  emit('update:selectedValue', option.value);
  isOpen.value = false;
  searchQuery.value = '';
}

// Focus search input when dropdown opens
watch(isOpen, async (newValue) => {
  if (newValue && props.searchable) {
    await nextTick();
    searchInput.value?.focus();
  }
});

// Close dropdown when clicking outside
function handleOutsideClick(event) {
  const dropdown = document.getElementById(props.id + '-dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    isOpen.value = false;
  }
}

// Handle escape key to close dropdown
function handleKeyDown(event) {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
}

// Add event listeners
onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick);
  document.addEventListener('keydown', handleKeyDown);
});

// Remove event listeners
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick);
  document.removeEventListener('keydown', handleKeyDown);
});

// Watch for external changes to selectedValue
watch(() => props.selectedValue, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    console.log(`${props.label} selectedValue prop changed: ${oldVal} -> ${newVal}`);
  }
});
</script>