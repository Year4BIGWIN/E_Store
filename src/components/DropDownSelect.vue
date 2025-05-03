<!-- DropdownSelection.vue -->
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <select
      :id="id"
      :value="selectedValue"
      @change="handleChange($event)"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
  
<script setup>
import { watch } from 'vue';

const props = defineProps({
  id: String,
  label: String,
  options: Array,
  selectedValue: String,
});

const emit = defineEmits(['update:selectedValue']);

// Use a more explicit change handler
function handleChange(event) {
  const newValue = event.target.value;
  console.log(`${props.label} changing value from "${props.selectedValue}" to "${newValue}"`);
  emit('update:selectedValue', newValue);
}

// Add a watcher to log changes from parent
watch(() => props.selectedValue, (newVal, oldVal) => {
  console.log(`${props.label} selectedValue prop changed: ${oldVal} -> ${newVal}`);
});
</script>