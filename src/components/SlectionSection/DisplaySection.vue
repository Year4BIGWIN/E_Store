<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Screen Size :" v-model="formData.screenSize" />
      <Input label="Display Type :" v-model="formData.displayType" />
      <Input label="Resolution :" v-model="formData.resolution" />
      <Input label="Refresh Rate :" v-model="formData.refreshRate" />
      <Input label="Brightness :" v-model="formData.brightness" />
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