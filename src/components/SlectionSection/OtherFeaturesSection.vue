<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Fingerprint Sensor :" v-model="formData.fingerprintSensor" />
      <Input label="Face Unlock :" v-model="formData.faceUnlock" />
      <Input label="Audio :" v-model="formData.audio" />
      <Input label="Biometrics :" v-model="formData.biometrics" />
      <Input label="Custom Features :" v-model="formData.customFeatures" />
    </div>
  </template>
  
  <script setup>
  import { defineProps } from "vue";
  import Input from "@/components/Input.vue";
  defineProps({
    formData: {
      type: Object,
      required: true,
    },
  });
  </script>