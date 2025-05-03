<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Material :" v-model="localDisplay.material" />
      <Input label="Dimensions :" v-model="localDisplay.dimensions" />
      <Input label="Weight :" v-model="localDisplay.weight" />
      <Input label="Water Resistance :" v-model="localDisplay.waterResistance" />
      <Input label="Color Options :" v-model="localDisplay.colorOptions" />
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