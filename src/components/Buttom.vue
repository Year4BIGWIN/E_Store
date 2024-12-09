<template>
    <button
      :class="[
        'inline-flex items-center border-2 justify-center font-medium rounded-full transition duration-200',
        sizeClasses,
        variantClasses,
        disabled ? 'opacity-50' : 'hover:brightness-75',
      ]"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot></slot>
    </button>
  </template>
  
  <script setup>
  // Props
  import { computed } from "vue";
  
  const props = defineProps({
    variant: {
      type: String,
      default: "default",
      validator: (value) =>
        ["default", "primary", "secondary", "danger"].includes(value),
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });
  
  // Emits
  const emit = defineEmits(["click"]);
  
  // Computed classes
  const variantClasses = computed(() => {
    switch (props.variant) {
      case "primary":
        return "bg-black text-white";
      case "secondary":
        return "bg-[#f5f5f5] text-black";
      case "danger":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  });
  
  const sizeClasses = computed(() => {
    switch (props.size) {
      case "sm":
        return "px-3 py-1 text-sm";
      case "lg":
        return "px-6 py-2 text-md";
      default:
        return "px-4 py-2 text-base";
    }
  });
  
  // Click handler
  const handleClick = (event) => {
    if (!props.disabled) {
      emit("click", event);
    }
  };
  </script>
  