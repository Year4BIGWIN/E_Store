<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="User Interface :" v-model="formData.userInterface" />
      <Input label="Software Updates :" v-model="formData.softwareUpdates" />
      <Input label="Pre-installed Apps :" v-model="formData.preInstalledApps" />
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