<template>
  <div
    v-if="showDialog"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-5 rounded-md w-[700px] flex gap-6">
      <!-- Left Side - Upload Section -->
      <div class="w-1/3 flex flex-col">
        <h2 class="text-xl font-bold mb-4">Product Image</h2>
        <Upload
          :uploadedImageUrl="formData.image_url"
          @update:uploadedImageUrl="formData.image_url = $event"
          class="h-64 w-full border-2 border-dashed rounded-lg flex items-center justify-center"
        />
      </div>

      <!-- Right Side - Form Section -->
      <div class="w-2/3">
        <form @submit.prevent="handleSubmit">
          <h2 class="text-xl font-bold mb-4">Add Product</h2>
          <div class="w-full grid grid-cols-2 gap-2">
            <Input label="Model Name :" v-model="formData.model" required />
            <Input
              label="Stock :"
              v-model="formData.stock"
              type="number"
              required
            />
            <Input
              label="Price :"
              type="number"
              v-model="formData.price"
              required
            />
            <Input label="Release Date :" v-model="formData.releaseDate" />
            <Input
              label="Operating System :"
              v-model="formData.operatingSystem"
            />
          </div>

          <div class="mt-4 flex gap-2">
            <DropdownSelection
              id="type-select"
              label="Choose type:"
              :options="typeOptions"
              v-model:selectedValue="selectedType"
              required
              class="flex-1"
            />

            <DropdownSelection
              id="brand-select"
              label="Choose Brand:"
              :options="brandOptions"
              v-model:selectedValue="selectedBrand"
              required
              class="flex-1"
            />
          </div>

          <div class="mt-4">
            <DropdownSelection
              id="section-select"
              label="Add Description:"
              :options="sectionOptions"
              v-model:selectedValue="selectedSection"
              class="w-full"
            />
          </div>

          <div class="mt-4">
            <DisplaySection
              v-if="selectedSection === 'Display'"
              v-model:modelValue="formData.display"
            />
            <CameraSection
              v-if="selectedSection === 'Camera'"
              v-model:modelValue="formData.camera"
            />
            <PerformanceSection
              v-if="selectedSection === 'Performance'"
              v-model:modelValue="formData.performance"
            />
            <BatterySection
              v-if="selectedSection === 'Battery'"
              v-model:modelValue="formData.battery"
            />
            <ConnectivitySection
              v-if="selectedSection === 'Connectivity'"
              v-model:modelValue="formData.connectivity"
            />
            <BuildAndDesignSection
              v-if="selectedSection === 'BuildAndDesign'"
              v-model:modelValue="formData.buildAndDesign"
            />
            <OtherFeaturesSection
              v-if="selectedSection === 'OtherFeatures'"
              v-model:modelValue="formData.otherFeatures"
            />
            <SoftwareFeaturesSection
              v-if="selectedSection === 'SoftwareFeatures'"
              v-model:modelValue="formData.softwareFeatures"
            />
          </div>

          <div v-if="selectedTypeName === 'Phone'" class="mt-4 text-black">
            <!-- Keep conditional sections the same -->
          </div>

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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import axios from "axios";
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
import Upload from "./Upload.vue";

const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:showDialog"]);
const apiUrl = import.meta.env.VITE_APP_API_URL;

// State for selected type and section
const selectedType = ref("");
const selectedSection = ref("");
const selectedBrand = ref("");

// Dynamic options
const typeOptions = ref([{ value: "", label: "Choose Type" }]);
const brandOptions = ref([{ value: "", label: "Add Brand" }]);
const sectionOptions = ref([
  { value: "", label: "Add More" },
  { value: "Display", label: "Display" },
  { value: "Camera", label: "Camera" },
  { value: "Performance", label: "Performance" },
  { value: "Battery", label: "Battery" },
  { value: "Connectivity", label: "Connectivity" },
  { value: "BuildAndDesign", label: "Build and Design" },
  { value: "OtherFeatures", label: "Other Features" },
  { value: "SoftwareFeatures", label: "Software Features" },
]);

// Computed property to get type name
const selectedTypeName = computed(() => {
  return (
    typeOptions.value.find((t) => t.value === selectedType.value)?.label || ""
  );
});

// Form data state
const formData = reactive({
  model: "",
  releaseDate: "",
  operatingSystem: "",
  price: 0,
  brandId: null,
  productTypeId: null,
  image_url: "",
  stock: 0,
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

// Reset form when dialog opens
watch(
  () => props.showDialog,
  (newVal) => {
    if (newVal) resetForm();
  }
);

// Fetch initial data
onMounted(async () => {
  try {
    const [typesResponse, brandsResponse] = await Promise.all([
      axios.get(`${apiUrl}/productType`),
      axios.get(`${apiUrl}/brand`),
    ]);

    typeOptions.value = [
      { value: "", label: "Choose Type" },
      ...typesResponse.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ];

    brandOptions.value = [
      { value: "", label: "Add Brand" },
      ...brandsResponse.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ];
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }
});

function resetForm() {
  formData.model = "";
  formData.releaseDate = "";
  formData.operatingSystem = "";
  formData.price = 0;
  formData.brandId = null;
  formData.productTypeId = null;
  formData.image_url = "";
  formData.stock = 0;

  // Reset all nested objects
  Object.keys(formData.display).forEach((key) => (formData.display[key] = ""));
  Object.keys(formData.performance).forEach(
    (key) => (formData.performance[key] = "")
  );
  Object.keys(formData.camera).forEach((key) => (formData.camera[key] = ""));
  Object.keys(formData.battery).forEach((key) => (formData.battery[key] = ""));
  Object.keys(formData.connectivity).forEach(
    (key) => (formData.connectivity[key] = "")
  );
  Object.keys(formData.buildAndDesign).forEach(
    (key) => (formData.buildAndDesign[key] = "")
  );
  Object.keys(formData.otherFeatures).forEach(
    (key) => (formData.otherFeatures[key] = "")
  );
  Object.keys(formData.softwareFeatures).forEach(
    (key) => (formData.softwareFeatures[key] = "")
  );

  selectedType.value = "";
  selectedSection.value = "";
  selectedBrand.value = "";
}

async function handleSubmit() {
  try {
    // Validate required fields
    if (!formData.image_url) {
      alert("Please upload a product image");
      return;
    }
    if (!formData.model || !selectedType.value || !selectedBrand.value) {
      alert("Please fill out all required fields.");
      return;
    }

    const payload = {
      ...formData,
      brandId: Number(selectedBrand.value),
      productTypeId: Number(selectedType.value),
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    console.log("Submitting payload:", payload);

    const response = await axios.post(`${apiUrl}/product`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Success:", response.data);
    resetForm();
    closeDialog();
  } catch (error) {
    console.error("Error submitting product:", error);
    alert(
      error.response?.data?.message ||
        "Error submitting product. Please try again."
    );
  }
}

function closeDialog() {
  emit("update:showDialog", false);
}
</script>
