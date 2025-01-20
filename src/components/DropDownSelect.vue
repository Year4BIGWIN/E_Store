<template>
    <div class="w-full flex flex-col gap-1">
      <label :for="id" class="text-sm font-semibold text-gray-700">{{ label }}</label>
      <select
        :id="id"
        :value="selectedValue"
        @input="$emit('update:selectedValue', $event.target.value)"
        class="px-4 py-2 border rounded-md text-gray-800 focus:outline-none"
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