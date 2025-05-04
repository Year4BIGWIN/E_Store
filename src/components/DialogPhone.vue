<template>
  <div
    v-if="showDialog"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-5 rounded-md w-[900px] flex gap-6">
      <!-- Loading state for entire dialog -->
      <div v-if="isLoadingDropdowns" class="w-full py-20">
        <Loader />
        <p class="text-center mt-4 text-gray-600">Loading form data...</p>
      </div>

      <template v-else>
        <!-- Left: Image Upload -->
        <div class="w-1/2 flex flex-col">
          <h2 class="text-xl font-bold mb-4">Product Image</h2>
          <Uploads
            v-model:uploadedImages="formData.imageUrls"
            class="h-full w-full border-2 border-dashed rounded-lg"
          />
        </div>

        <!-- Right: Product Info -->
        <div class="w-1/2">
          <!-- Loading state for edit mode data -->
          <div v-if="isLoadingData" class="py-20">
            <Loader />
            <p class="text-center mt-4 text-gray-600">Loading product data...</p>
          </div>

          <form v-else @submit.prevent="handleSubmit">
            <h2 class="text-xl font-bold mb-4">
              {{ isEditMode ? "Edit Product" : "Add Product" }}
            </h2>

            <div class="grid grid-cols-2 gap-2">
              <Input label="Model Name :" v-model="formData.model" required />
              <Input
                label="Stock :"
                v-model="formData.stock"
                type="number"
                required
              />
              <Input
                label="Price :"
                v-model="formData.price"
                type="number"
                required
              />
              <Input
                label="Release Date :"
                v-model="formData.releaseDate"
                type="date"
              />
            </div>

            <div class="mt-2">
              <Input label="Description :" v-model="formData.description" />
            </div>

            <div class="mt-4 flex gap-2">
              <DropdownSelection
                label="Choose Type:"
                :options="typeOptions"
                v-model:selectedValue="selectedType"
                class="flex-1"
                required
              />
              <DropdownSelection
                label="Choose Brand:"
                :options="brandOptions"
                :selectedValue="selectedBrand"
                @update:selectedValue="updateSelectedBrand"
                class="flex-1"
                required
              />
            </div>

            <div class="mt-4">
              <DropdownSelection
                label="Add Description:"
                :options="sectionOptions"
                v-model:selectedValue="selectedSection"
                class="w-full"
              />
            </div>

            <div class="mt-4">
              <component
                v-if="sectionComponents[selectedSection]"
                :is="sectionComponents[selectedSection]"
                v-model:modelValue="formData[selectedSection]"
                :key="selectedSection"
              />
            </div>

            <div class="flex justify-end mt-4">
              <button
                type="button"
                @click="closeDialog"
                class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <Loader />
                </span>
                <span v-else>
                  {{ isEditMode ? "Update" : "Save" }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "vue3-toastify";

// Components
import Input from "@/components/Input.vue";
import DropdownSelection from "@/components/DropDownSelect.vue";
import Uploads from "@/components/Uploads.vue";
import Loader from "@/components/Loader.vue";
import DisplaySection from "@/components/SlectionSection/DisplaySection.vue";
import CameraSection from "@/components/SlectionSection/CameraSection.vue";
import PerformanceSection from "@/components/SlectionSection/PerformanceSection.vue";
import BatterySection from "@/components/SlectionSection/BatterySection.vue";
import ConnectivitySection from "@/components/SlectionSection/ConnectivitySection.vue";
import BuildAndDesignSection from "@/components/SlectionSection/BuildAndDesignSection.vue";
import OtherFeaturesSection from "@/components/SlectionSection/OtherFeaturesSection.vue";
import SoftwareFeaturesSection from "@/components/SlectionSection/SoftwareFeaturesSection.vue";
import AdditionalInfoSection from "@/components/SlectionSection/AdditionalInfoSection.vue";

// Props & Emits
const props = defineProps({
  showDialog: Boolean,
  isEditMode: { type: Boolean, default: false },
  currentProduct: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["update:showDialog", "postsuccess", "updatesuccess"]);

// Data
const token = new Cookies().get("auth_token");
const apiUrl = import.meta.env.VITE_APP_API_URL;

const selectedType = ref("");
const selectedBrand = ref("");
const selectedSection = ref("");
const isSubmitting = ref(false);
const message = ref("");
const isSuccess = ref(false);
const isLoadingData = ref(false);
const isLoadingDropdowns = ref(true);

const typeOptions = ref([{ value: "", label: "Choose Type" }]);
const brandOptions = ref([{ value: "", label: "Choose Brand" }]);
const sectionOptions = ref([
  { value: "", label: "Add More" },
  { value: "display", label: "Display" },
  { value: "camera", label: "Camera" },
  { value: "performance", label: "Performance" },
  { value: "battery", label: "Battery" },
  { value: "connectivity", label: "Connectivity" },
  { value: "buildAndDesign", label: "Build and Design" },
  { value: "otherFeatures", label: "Other Features" },
  { value: "softwareFeatures", label: "Software Features" },
  { value: "additionalInfo", label: "Additional Information" },
]);

const sectionComponents = {
  display: DisplaySection,
  camera: CameraSection,
  performance: PerformanceSection,
  battery: BatterySection,
  connectivity: ConnectivitySection,
  buildAndDesign: BuildAndDesignSection,
  otherFeatures: OtherFeaturesSection,
  softwareFeatures: SoftwareFeaturesSection,
  additionalInfo: AdditionalInfoSection,
};

// Replace your existing formData definition with this:
const formData = reactive({
  model: "",
  releaseDate: "",
  price: 0,
  stock: 0,
  description: "",
  imageUrls: [],
  display: {
    screenSize: "",
    displayType: "",
    resolution: "",
    refreshRate: "",
    brightness: "",
  },
  camera: {
    mainCamera: "",
    ultraWideCamera: "",
    telephotoCamera: "",
    frontCamera: "",
    videoRecording: "",
    features: "",
  },
  performance: {
    chipset: "",
    cpu: "",
    gpu: "",
    ram: "",
    storageOptions: "",
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
  additionalInfo: {},
});

// Watch dialog open state
watch(
  () => props.showDialog,
  (open) => {
    if (open) {
      message.value = "";
      if (props.isEditMode) loadProductData();
      else resetForm();
    }
  },
  { immediate: true }
);

// Debug watch for brand changes
watch(selectedBrand, (newValue, oldValue) => {
  console.log("Brand selection changed:", { old: oldValue, new: newValue });
});

// Enhanced debug watch for brand changes 
watch(selectedBrand, (newValue, oldValue) => {
  console.log("BRAND SELECTION CHANGED:", { 
    old: oldValue, 
    new: newValue,
    availableBrands: brandOptions.value.map(b => `${b.value}: ${b.label}`)
  });
  
  // Force the payload to update with the new brand
  const brandId = Number(newValue);
  console.log("New brandId will be:", brandId);
}, { deep: true });

// Direct handler for brand selection changes
function updateSelectedBrand(value) {
  console.log("updateSelectedBrand called with:", value);
  selectedBrand.value = value;
}

// Enhanced fetch dropdown data with loader
onMounted(async () => {
  isLoadingDropdowns.value = true;
  try {
    const [types, brands] = await Promise.all([
      axios.get(`${apiUrl}/productType`),
      axios.get(`${apiUrl}/brand`),
    ]);
    
    typeOptions.value = [
      { value: "", label: "Choose Type" },
      ...types.data.data.map((t) => ({ 
        value: t.id.toString(),
        label: t.name 
      }))
    ];
    
    brandOptions.value = [
      { value: "", label: "Choose Brand" },
      ...brands.data.data.map((b) => ({ 
        value: b.id.toString(),
        label: b.name 
      }))
    ];
    
    // If in edit mode and dialog is open, reload data to ensure proper selection
    if (props.isEditMode && props.showDialog) {
      loadProductData();
    }
  } catch (error) {
    console.error("Error loading types/brands:", error);
    toast.error("Failed to load form data. Please try again.");
  } finally {
    isLoadingDropdowns.value = false;
  }
});

// Enhanced form submission with toast notifications
async function handleSubmit() {
  isSubmitting.value = true;
  message.value = "";

  if (
    !formData.model ||
    !formData.imageUrls.length ||
    !selectedType.value ||
    !selectedBrand.value
  ) {
    toast.error("Please fill out all required fields including at least one image.");
    isSuccess.value = false;
    isSubmitting.value = false;
    return;
  }

  const payload = {
    ...formData,
    brandId: Number(selectedBrand.value),
    productTypeId: Number(selectedType.value),
    imageUrls: [...formData.imageUrls],
  };

  try {
    const url = props.isEditMode
      ? `${apiUrl}/product/${props.currentProduct.id}`
      : `${apiUrl}/product`;

    const method = props.isEditMode ? "put" : "post";
    const response = await axios[method](url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const successMsg = props.isEditMode
      ? "Product updated successfully!"
      : "Product added successfully!";
    
    toast.success(successMsg);
    isSuccess.value = true;

    props.isEditMode
      ? emit("updatesuccess", response.data)
      : emit("postsuccess", response.data);

    setTimeout(() => closeDialog(), 1500);
  } catch (error) {
    console.error("Submission error:", error);
    const errorMsg = error.response?.data?.message || "Something went wrong.";
    toast.error(errorMsg);
    isSuccess.value = false;
  } finally {
    isSubmitting.value = false;
  }
}

// Enhanced function to load product data with loader
function loadProductData() {
  isLoadingData.value = true;
  try {
    const product = props.currentProduct;

    // Reset base fields
    formData.model = product.model || "";
    formData.releaseDate = product.releaseDate || "";
    formData.price = product.price || 0;
    formData.stock = product.stock || 0;
    formData.description = product.description || "";

    // Handle image formats
    const imgs = Array.isArray(product.imageUrls)
      ? product.imageUrls
      : Array.isArray(product.image_url)
      ? product.image_url
      : Array.isArray(product.images)
      ? product.images
      : typeof product.image_url === "string"
      ? [product.image_url]
      : [];

    formData.imageUrls = [...imgs]; // force reactivity

    // Select dropdowns - ensure they're converted to strings for dropdown selection
    selectedBrand.value = product.brandId ? product.brandId.toString() : 
                          product.brand?.id ? product.brand.id.toString() : "";
    selectedType.value = product.productTypeId ? product.productTypeId.toString() : 
                         product.productType?.id ? product.productType.id.toString() : "";

    console.log("Setting brand to:", selectedBrand.value, "from product:", product);
    
    // Load sections with proper defaults for each section type
    formData.display = product.display ? { ...product.display } : {
      screenSize: "", displayType: "", resolution: "", refreshRate: "", brightness: ""
    };
    
    formData.camera = product.camera ? { ...product.camera } : {
      mainCamera: "", ultraWideCamera: "", telephotoCamera: "", frontCamera: "", 
      videoRecording: "", features: ""
    };
    
    formData.performance = product.performance ? { ...product.performance } : {
      chipset: "", cpu: "", gpu: "", ram: "", storageOptions: ""
    };
    
    formData.battery = product.battery ? { ...product.battery } : {
      batteryCapacity: "", chargingSpeed: "", batteryLife: ""
    };
    
    formData.connectivity = product.connectivity ? { ...product.connectivity } : {
      fiveGSupport: "", wifi: "", bluetooth: "", nfc: "", usb: "", gps: ""
    };
    
    formData.buildAndDesign = product.buildAndDesign ? { ...product.buildAndDesign } : {
      material: "", dimensions: "", weight: "", waterResistance: "", colorOptions: ""
    };
    
    formData.otherFeatures = product.otherFeatures ? { ...product.otherFeatures } : {
      fingerprintSensor: "", faceUnlock: "", audio: "", biometrics: "", customFeatures: ""
    };
    
    formData.softwareFeatures = product.softwareFeatures ? { ...product.softwareFeatures } : {
      userInterface: "", softwareUpdates: "", preInstalledApps: ""
    };
    
    formData.additionalInfo = product.additionalInfo ? { ...product.additionalInfo } : {};

    // Set initial selected section for better UX
    if (product.display && Object.keys(product.display).some(k => product.display[k])) {
      selectedSection.value = "display";
    }
  } catch (error) {
    console.error("Error loading product data:", error);
    toast.error("Failed to load product data");
  } finally {
    isLoadingData.value = false;
  }
}

// Reset form
function resetForm() {
  Object.keys(formData).forEach((key) => {
    formData[key] =
      key === "imageUrls" ? [] : typeof formData[key] === "object" ? {} : "";
  });
  selectedType.value = "";
  selectedSection.value = "";
  selectedBrand.value = "";
}

// Close dialog
function closeDialog() {
  emit("update:showDialog", false);
}
</script>
