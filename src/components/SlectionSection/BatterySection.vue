<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Battery Capacity :" v-model="localDisplay.batteryCapacity" />
      <Input label="Charging Speed :" v-model="localDisplay.chargingSpeed" />
      <Input label="Battery Life :" v-model="localDisplay.batteryLife" />
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