<!-- DropdownSelection.vue -->
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <select
      :id="id"
      :value="selectedValue"
      @change="$emit('update:selectedValue', $event.target.value)"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
  
  <script setup>
  defineProps({
    id: String,
    label: String,
    options: Array,
    selectedValue: String,
  });
  
  defineEmits(['update:selectedValue']);
  </script>