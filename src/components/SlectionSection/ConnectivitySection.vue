<template>
    <div class="grid grid-cols-2 gap-2">
      <Input label="5G Support :" v-model="formData.fiveGSupport" />
      <Input label="Wi-Fi :" v-model="formData.wifi" />
      <Input label="Bluetooth :" v-model="formData.bluetooth" />
      <Input label="NFC :" v-model="formData.nfc" />
      <Input label="USB :" v-model="formData.usb" />
      <Input label="GPS :" v-model="formData.gps" />
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