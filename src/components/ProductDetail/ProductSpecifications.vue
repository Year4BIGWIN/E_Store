<script setup>
import { computed } from 'vue';
import DropDown from "@/components/DropDown.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const extractDetails = (category) => {
  return computed(() => {
    return Object.entries(props.product?.[category] || {})
      .map(([label, value]) => ({ label, value }))
      .filter((detail) => detail.value);
  });
};

const displayDetails = extractDetails("display");
const performanceDetails = extractDetails("performance");
const cameraDetails = extractDetails("camera");
const batteryDetails = extractDetails("battery");
const connectivityDetails = extractDetails("connectivity");
const buildDetails = extractDetails("build");
const otherFeatures = extractDetails("otherFeatures");
const softwareFeatures = extractDetails("softwareFeatures");
const additionalDetails = extractDetails("additionalInfo");

// Generic component to render specification sections
const SpecSection = (details, title, icon) => {
  if (details.value.length === 0) return null;
  
  return {
    title, 
    icon,
    details: details.value
  };
};

// All spec sections
const specSections = computed(() => [
  SpecSection(additionalDetails, "Description", "fa-solid fa-info-circle"),
  SpecSection(displayDetails, "Display", "fa-solid fa-tv"),
  SpecSection(performanceDetails, "Performance", "fa-solid fa-microchip"),
  SpecSection(cameraDetails, "Camera", "fa-solid fa-camera"),
  SpecSection(batteryDetails, "Battery", "fa-solid fa-battery-full"),
  SpecSection(connectivityDetails, "Connectivity", "fa-solid fa-wifi"),
  SpecSection(buildDetails, "Build & Design", "fa-solid fa-pencil-ruler"),
  SpecSection(otherFeatures, "Other Features", "fa-solid fa-star"),
  SpecSection(softwareFeatures, "Software Features", "fa-solid fa-code")
].filter(section => section !== null));

// Split into left and right columns for layout
const leftColumnSections = computed(() => specSections.value.slice(0, Math.ceil(specSections.value.length / 2)));
const rightColumnSections = computed(() => specSections.value.slice(Math.ceil(specSections.value.length / 2)));
</script>

<template>
  <div class="w-full flex flex-col gap-6 mt-8">
    <h1 class="font-semibold text-2xl border-b pb-3">Product Specifications</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="flex flex-col gap-3">
        <template v-for="(section, index) in leftColumnSections" :key="`left-${index}`">
          <DropDown class="w-full shadow-sm" :title="section.title" :icon="section.icon">
            <ul class="divide-y divide-gray-100">
              <li v-for="(detail, idx) in section.details" :key="idx" class="py-3 flex flex-wrap items-start">
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>
        </template>
      </div>

      <!-- Right Column -->
      <div class="flex flex-col gap-3">
        <template v-for="(section, index) in rightColumnSections" :key="`right-${index}`">
          <DropDown class="w-full shadow-sm" :title="section.title" :icon="section.icon">
            <ul class="divide-y divide-gray-100">
              <li v-for="(detail, idx) in section.details" :key="idx" class="py-3 flex flex-wrap items-start">
                <span class="w-2/5 text-gray-600 font-medium">{{ detail.label }}:</span>
                <span class="w-3/5 text-gray-800">{{ detail.value }}</span>
              </li>
            </ul>
          </DropDown>
        </template>
      </div>
    </div>
  </div>
</template>