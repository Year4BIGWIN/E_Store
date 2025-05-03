<template>
  <div class="w-full flex flex-col gap-1">
    <label 
      v-if="label" 
      :for="id" 
      class="text-sm font-semibold text-gray-700"
    >
      {{ label }}
    </label>
    <input 
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      class="px-4 py-2 border rounded-md text-gray-800 focus:outline-none"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props
defineProps({
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});
</script>