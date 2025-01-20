<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Material :" v-model="formData.material" />
      <Input label="Dimensions :" v-model="formData.dimensions" />
      <Input label="Weight :" v-model="formData.weight" />
      <Input label="Water Resistance :" v-model="formData.waterResistance" />
      <Input label="Color Options :" v-model="formData.colorOptions" />
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