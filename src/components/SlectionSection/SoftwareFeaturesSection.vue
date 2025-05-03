<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="User Interface :" v-model="localDisplay.userInterface" />
      <Input label="Software Updates :" v-model="localDisplay.softwareUpdates" />
      <Input label="Pre-installed Apps :" v-model="localDisplay.preInstalledApps" />
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, computed } from "vue";
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