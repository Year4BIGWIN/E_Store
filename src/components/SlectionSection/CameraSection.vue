<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Main Camera :" v-model="localDisplay.mainCamera" />
      <Input label="Ultra Wide Camera :" v-model="localDisplay.ultraWideCamera" />
      <Input label="Telephoto Camera :" v-model="localDisplay.telephotoCamera" />
      <Input label="Front Camera :" v-model="localDisplay.frontCamera" />
      <Input label="Video Recording :" v-model="localDisplay.videoRecording" />
      <Input label="Features :" v-model="localDisplay.features" />
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