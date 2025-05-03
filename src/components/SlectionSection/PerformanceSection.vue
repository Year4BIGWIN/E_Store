<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Chipset :" v-model="localDisplay.chipset" />
      <Input label="CPU :" v-model="localDisplay.cpu" />
      <Input label="GPU :" v-model="localDisplay.gpu" />
      <Input label="RAM :" v-model="localDisplay.ram" />
      <Input label="Storage Options :" v-model="localDisplay.storageOptions" />
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, computed  } from "vue";
  import Input from "@/components/Input.vue";
  const props = defineProps({
  modelValue: {  // Changed from formData to modelValue
    type: Object,
    required: true,
  },
});
  const emit = defineEmits(["update:modelValue"]);

const localDisplay = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
  </script>