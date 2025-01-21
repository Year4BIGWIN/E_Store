<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Fingerprint Sensor :" v-model="localDisplay.fingerprintSensor" />
      <Input label="Face Unlock :" v-model="localDisplay.faceUnlock" />
      <Input label="Audio :" v-model="localDisplay.audio" />
      <Input label="Biometrics :" v-model="localDisplay.biometrics" />
      <Input label="Custom Features :" v-model="localDisplay.customFeatures" />
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