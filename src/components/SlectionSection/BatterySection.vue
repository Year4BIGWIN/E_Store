<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="Battery Capacity :" v-model="formData.batteryCapacity" />
      <Input label="Charging Speed :" v-model="formData.chargingSpeed" />
      <Input label="Battery Life :" v-model="formData.batteryLife" />
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