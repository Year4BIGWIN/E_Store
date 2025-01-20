<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Main Camera :" v-model="formData.mainCamera" />
      <Input label="Ultra Wide Camera :" v-model="formData.ultraWideCamera" />
      <Input label="Telephoto Camera :" v-model="formData.telephotoCamera" />
      <Input label="Front Camera :" v-model="formData.frontCamera" />
      <Input label="Video Recording :" v-model="formData.videoRecording" />
      <Input label="Features :" v-model="formData.features" />
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