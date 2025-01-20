<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Chipset :" v-model="formData.chipset" />
      <Input label="CPU :" v-model="formData.cpu" />
      <Input label="GPU :" v-model="formData.gpu" />
      <Input label="RAM :" v-model="formData.ram" />
      <Input label="Storage Options :" v-model="formData.storageOptions" />
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