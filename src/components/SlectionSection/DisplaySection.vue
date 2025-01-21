<template>
  <div class="grid grid-cols-2 gap-2">
    <Input label="Screen Size :" v-model="localDisplay.screenSize" />
    <Input label="Display Type :" v-model="localDisplay.displayType" />
    <Input label="Resolution :" v-model="localDisplay.resolution" />
    <Input label="Refresh Rate :" v-model="localDisplay.refreshRate" />
    <Input label="Brightness :" v-model="localDisplay.brightness" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import Input from "@/components/Input.vue";

const props = defineProps({
  modelValue: {
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