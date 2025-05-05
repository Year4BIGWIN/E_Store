<template>
  <div class="grid grid-cols-2 gap-2">
    <Input label="5G Support :" v-model="localConnectivity.fiveGSupport" />
    <Input label="Wi-Fi :" v-model="localConnectivity.wifi" />
    <Input label="Bluetooth :" v-model="localConnectivity.bluetooth" />
    <Input label="NFC :" v-model="localConnectivity.nfc" />
    <Input label="USB :" v-model="localConnectivity.usb" />
    <Input label="GPS :" v-model="localConnectivity.gps" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import Input from "@/components/Input.vue";

const props = defineProps({
  modelValue: {  // Changed from formData to modelValue
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const localConnectivity = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>