<template>
  <div v-if="showDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-5 rounded-md w-[700px] flex gap-6">
      <!-- Left Side - Upload Section -->
      <div class="w-1/3 flex flex-col">
        <h2 class="text-xl font-bold mb-4">Product Image</h2>
        <Uploads 
          :uploadedImages="formData.imageUrls" 
          @update:uploadedImages="formData.imageUrls = $event" 
          class="h-64 w-full border-2 border-dashed rounded-lg"
        />
      </div>

      <!-- Right Side - Form Section -->
      <div class="w-2/3">
        <form @submit.prevent="handleSubmit">
          <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit Product' : 'Add Product' }}</h2>          
          <div class="w-full grid grid-cols-2 gap-2">
            <Input label="Model Name :" v-model="formData.model" required />
            <Input label="Stock :" v-model="formData.stock" type="number" required />
            <Input label="Price :" type="number" v-model="formData.price" required />
            <Input label="Release Date :" type="date" v-model="formData.releaseDate" />
          </div>

          <div class="mt-4 flex gap-2">
            <DropdownSelection id="type-select" label="Choose type:" :options="typeOptions" v-model:selectedValue="selectedType" required class="flex-1" />
            <DropdownSelection id="brand-select" label="Choose Brand:" :options="brandOptions" v-model:selectedValue="selectedBrand" required class="flex-1" />
          </div>

          <div class="mt-4">
            <DropdownSelection id="section-select" label="Add Description:" :options="sectionOptions" v-model:selectedValue="selectedSection" class="w-full" />
          </div>

          <div class="mt-4">
            <component :is="sectionComponents[selectedSection]" v-if="sectionComponents[selectedSection]" v-model:modelValue="formData[selectedSection]" />
          </div>

          <div class="flex justify-end mt-4">
            <button type="button" @click="closeDialog" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Save') }}
            </button>
          </div>
          <p v-if="message" class="mt-2 text-center" :class="isSuccess ? 'text-green-600' : 'text-red-600'">
            {{ message }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";
import Cookies from "universal-cookie";
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
import AdditionalInfoSection from "@/components/SlectionSection/AdditionalInfoSection.vue";
import Uploads from "@/components/Uploads.vue";


const props = defineProps({ 
  showDialog: Boolean,
  isEditMode: {
    type: Boolean,
    default: false
  },
  currentProduct: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(["update:showDialog", "postsuccess", "updatesuccess"]);
const token = new Cookies().get("auth_token");
const apiUrl = import.meta.env.VITE_APP_API_URL;

// State
const selectedType = ref("");
const selectedSection = ref("");
const selectedBrand = ref("");
const isSubmitting = ref(false);
const message = ref("");
const isSuccess = ref(false);
const typeOptions = ref([{ value: "", label: "Choose Type" }]);
const brandOptions = ref([{ value: "", label: "Add Brand" }]);
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

const formData = reactive({
  model: "",
  releaseDate: "",
  price: 0,
  stock: 0,
  imageUrls: [],
  display: {},
  camera: {},
  performance: {},
  battery: {},
  connectivity: {},
  buildAndDesign: {},
  otherFeatures: {},
  softwareFeatures: {},
  additionalInfo: {},
});

watch(() => props.showDialog, (newVal) => {
  if (newVal) {
    message.value = '';
    
    if (props.isEditMode && props.currentProduct) {
      console.log("Loading existing product data:", props.currentProduct);
      loadProductData();
    } else {
      resetForm();
    }
  }
});

onMounted(async () => {
  try {
    const [typesResponse, brandsResponse] = await Promise.all([
      axios.get(`${apiUrl}/productType`),
      axios.get(`${apiUrl}/brand`),
    ]);

    typeOptions.value.push(...typesResponse.data.data.map(item => ({ value: item.id, label: item.name })));
    brandOptions.value.push(...brandsResponse.data.data.map(item => ({ value: item.id, label: item.name })));
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }
});

// Update loadProductData function to handle imageUrls as array
function loadProductData() {
  if (!props.currentProduct) return;

  console.log("Loading product data:", props.currentProduct);
  
  // Populate basic fields
  formData.model = props.currentProduct.model || "";
  formData.price = props.currentProduct.price || 0;
  formData.stock = props.currentProduct.stock || 0;
  formData.releaseDate = props.currentProduct.releaseDate || "";
  
  // Handle imageUrls as array
  formData.imageUrls = Array.isArray(props.currentProduct.imageUrls) 
    ? props.currentProduct.imageUrls 
    : props.currentProduct.imageUrls ? [props.currentProduct.imageUrls] : [];
  
  // Set selected brand and type
  selectedBrand.value = props.currentProduct.brandId?.toString() || "";
  selectedType.value = props.currentProduct.productTypeId?.toString() || "";
  
  // Populate sections if they exist in the current product
  ['display', 'camera', 'performance', 'battery', 'connectivity', 
   'buildAndDesign', 'otherFeatures', 'softwareFeatures', 'additionalInfo'].forEach(section => {
    if (props.currentProduct[section]) {
      formData[section] = { ...props.currentProduct[section] };
    } else {
      formData[section] = {};
    }
  });
  
  console.log("Form data after loading:", formData);
}


function resetForm() {
  // Reset imageUrls to empty array instead of empty string
  Object.keys(formData).forEach(key => {
    if (key === 'imageUrls') {
      formData[key] = [];
    } else {
      formData[key] = typeof formData[key] === "object" ? {} : "";
    }
  });
  selectedType.value = "";
  selectedSection.value = "";
  selectedBrand.value = "";
}

async function handleSubmit() {
  isSubmitting.value = true;
  message.value = '';
  
  try {
    // Check for required fields, ensuring imageUrls has at least one image
    if (!formData.imageUrls.length || !formData.model || !selectedType.value || !selectedBrand.value) {
      message.value = "Please fill out all required fields including at least one image.";
      isSuccess.value = false;
      isSubmitting.value = false;
      return;
    }

    const payload = { 
      ...formData, 
      brandId: Number(selectedBrand.value), 
      productTypeId: Number(selectedType.value) 
    };
    
    if (props.isEditMode) {
      // Update existing product
      const response = await axios.put(
        `${apiUrl}/product/${props.currentProduct.id}`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      isSuccess.value = true;
      message.value = "Product updated successfully!";
      emit("updatesuccess", response.data);
      
      setTimeout(() => {
        closeDialog();
      }, 1500);
    } else {
      // Create new product
      const response = await axios.post(
        `${apiUrl}/product`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      isSuccess.value = true;
      message.value = "Product successfully added!";
      emit("postsuccess", response.data);
      resetForm();
      
      setTimeout(() => {
        closeDialog();
      }, 1500);
    }
  } catch (error) {
    console.error("Error submitting product:", error);
    isSuccess.value = false;
    message.value = error.response?.data?.message || "Error saving product. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}

function closeDialog() {
  emit("update:showDialog", false);
}
</script>