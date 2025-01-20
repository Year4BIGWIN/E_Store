<template>
  <div
    v-if="showDialog"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-5 rounded-md w-[500px]">
      <h2 class="text-xl font-bold mb-4">Add Product</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Model Name and Type Selection -->
        <div class="w-full grid grid-cols-2 gap-2">
          <Input label="Model Name :" v-model="formData.model" />
          <Input label="Stock :" v-model="formData.stock" />
          <Input label="Price :" type="number" v-model="formData.price" />
          <Input label="Release Date :" v-model="formData.releaseDate" />
          <Input
            label="Operating System :"
            v-model="formData.operatingSystem"
          />
        </div>

        <!-- Section Selection Dropdown -->
        <div class="mt-4 flex gap-2">
          <DropdownSelection
            id="type-select"
            label="Choose type:"
            :options="typeOptions"
            v-model:selectedValue="selectedType"
          />

          <DropdownSelection
            id="brand-select"
            label="Choose Brand:"
            :options="brandOptions"
            v-model:selectedValue="selectedBrand"
          />
        </div>
        <div class="mt-4">
          <DropdownSelection
            id="section-select"
            label="Add Description:"
            :options="sectionOptions"
            v-model:selectedValue="selectedSection"
          />
        </div>

        <!-- Conditional Input Fields Based on Selected Section -->
        <div v-if="selectedType === 'Mobile Phone'" class="mt-4 text-black">
          <DisplaySection
            v-if="selectedSection === 'Display'"
            :formData="formData.display"
          />
          <CameraSection
            v-if="selectedSection === 'Camera'"
            :formData="formData.camera"
          />
          <PerformanceSection
            v-if="selectedSection === 'Performance'"
            :formData="formData.performance"
          />
          <BatterySection
            v-if="selectedSection === 'Battery'"
            :formData="formData.battery"
          />
          <ConnectivitySection
            v-if="selectedSection === 'Connectivity'"
            :formData="formData.connectivity"
          />
          <BuildAndDesignSection
            v-if="selectedSection === 'BuildAndDesign'"
            :formData="formData.buildAndDesign"
          />
          <OtherFeaturesSection
            v-if="selectedSection === 'OtherFeatures'"
            :formData="formData.otherFeatures"
          />
          <SoftwareFeaturesSection
            v-if="selectedSection === 'SoftwareFeatures'"
            :formData="formData.softwareFeatures"
          />
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end mt-4">
          <button
            type="button"
            @click="closeDialog"
            class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Input from "@/components/Input.vue";
import DropdownSelection from "@/components/DropDownSelect.vue";
import DisplaySection from "@/components/SlectionSection/DisplaySection.vue";
import CameraSection from "@/components/SlectionSection/CameraSection.vue";
import PerformanceSection from "@/components/SlectionSection/PerformanceSection.vue";
import BatterySection from "@/components/SlectionSection/BatterySection.vue";
import ConnectivitySection from "@/components/SlectionSection/ConnectivitySection.vue";
import BuildAndDesignSection from "@/components/SlectionSection/BuildAndDesignSection.vue";
import OtherFeaturesSection from "@/components/SlectionSection/OtherFeaturesSection.vue";
import SoftwareFeaturesSection from "@/components/SlectionSection/SoftwareFeaturesSection.vue";

// Props and Emits
defineProps({
  showDialog: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:showDialog"]);
const apiUrl = import.meta.env.VITE_API_URL;

// State for selected type and section
const selectedType = ref("Mobile Phone");
const selectedSection = ref("");
const selectedBrand = ref("");

// Dropdown options
const typeOptions = [
  { value: "Mobile Phone", label: "Mobile Phone" },
  { value: "Tablet", label: "Tablet" },
  { value: "Smart Watch", label: "Smart Watch" },
  { value: "Accessories", label: "Accessories" },
];

const sectionOptions = [
  { value: "", label: "Add More" },
  { value: "Display", label: "Display" },
  { value: "Camera", label: "Camera" },
  { value: "Performance", label: "Performance" },
  { value: "Battery", label: "Battery" },
  { value: "Connectivity", label: "Connectivity" },
  { value: "BuildAndDesign", label: "Build and Design" },
  { value: "OtherFeatures", label: "Other Features" },
  { value: "SoftwareFeatures", label: "Software Features" },
];

const brandOptions = [
  { value: "", label: "Add Brand" },
  { value: "Samsung", label: "Samsung" },
  { value: "Apple", label: "Apple" },
];

// Form data state
const formData = reactive({
  model: "",
  releaseDate: "",
  operatingSystem: "",
  price: 0,
  brand: null,
  productType: null,
  image_url: null,
  stock: null,
  display: {
    screenSize: "",
    displayType: "",
    resolution: "",
    refreshRate: "",
    brightness: "",
  },
  performance: {
    chipset: "",
    cpu: "",
    gpu: "",
    ram: "",
    storageOptions: "",
  },
  camera: {
    mainCamera: "",
    ultraWideCamera: "",
    telephotoCamera: "",
    frontCamera: "",
    videoRecording: "",
    features: "",
  },
  battery: {
    batteryCapacity: "",
    chargingSpeed: "",
    batteryLife: "",
  },
  connectivity: {
    fiveGSupport: "",
    wifi: "",
    bluetooth: "",
    nfc: "",
    usb: "",
    gps: "",
  },
  buildAndDesign: {
    material: "",
    dimensions: "",
    weight: "",
    waterResistance: "",
    colorOptions: "",
  },
  otherFeatures: {
    fingerprintSensor: "",
    faceUnlock: "",
    audio: "",
    biometrics: "",
    customFeatures: "",
  },
  softwareFeatures: {
    userInterface: "",
    softwareUpdates: "",
    preInstalledApps: "",
  },
});

function resetForm() {
  formData.model = "";
  formData.releaseDate = "";
  formData.operatingSystem = "";
  formData.price = 0;
  formData.brand = "";
  formData.productType = "";
  formData.image_url = null;
  formData.stock = null;
  formData.display = {
    screenSize: "",
    displayType: "",
    resolution: "",
    refreshRate: "",
    brightness: "",
  };
  formData.performance = {
    chipset: "",
    cpu: "",
    gpu: "",
    ram: "",
    storageOptions: "",
  };
  formData.camera = {
    mainCamera: "",
    ultraWideCamera: "",
    telephotoCamera: "",
    frontCamera: "",
    videoRecording: "",
    features: "",
  };
  formData.battery = {
    batteryCapacity: "",
    chargingSpeed: "",
    batteryLife: "",
  };
  formData.connectivity = {
    fiveGSupport: "",
    wifi: "",
    bluetooth: "",
    nfc: "",
    usb: "",
    gps: "",
  };
  formData.buildAndDesign = {
    material: "",
    dimensions: "",
    weight: "",
    waterResistance: "",
    colorOptions: "",
  };
  formData.otherFeatures = {
    fingerprintSensor: "",
    faceUnlock: "",
    audio: "",
    biometrics: "",
    customFeatures: "",
  };
  formData.softwareFeatures = {
    userInterface: "",
    softwareUpdates: "",
    preInstalledApps: "",
  };
  selectedType.value = "Mobile Phone"; // Default value
  selectedSection.value = "";
  selectedBrand.value = "";
}

async function handleSubmit() {
  try {
    // Simple validation example
    if (!formData.model || !formData.brand || !formData.productType) {
      alert("Please fill out all required fields.");
      return;
    }

    // Ensure the selected brand and type are assigned to the formData
    formData.brand = selectedBrand.value;
    formData.productType = selectedType.value;

    const response = await fetch(`${apiUrl}/phones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Network response was not ok");
    }

    const result = await response.json();
    console.log("Success:", result);
    resetForm(); // Reset the form after successful submission
    closeDialog();
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  }
}

// Close dialog
function closeDialog() {
  emit("update:showDialog", false);
}
</script>
