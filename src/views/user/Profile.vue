<template>
  <div class="max-w-[1152px] w-[100vw] mx-auto px-4 md:px-6 flex flex-col md:flex-row md:gap-10 py-10">
    <!-- Sidebar navigation - horizontal on mobile, vertical sidebar on larger screens -->
    <div class="w-full md:w-1/6 hidden md:flex md:flex-col gap-4 font-semibold text-lg sticky top-20 h-fit mb-6 md:mb-0 overflow-x-auto pb-2 md:pb-0">
      <a 
        href="#profile-section" 
        @click.prevent="scrollToSection('profile-section')" 
        class="hover:text-blue-500 whitespace-nowrap" 
        :class="{'text-blue-500': activeSection === 'profile-section'}"
      >
        <span>My Profile</span>
      </a>
      <a 
        href="#orders-section" 
        @click.prevent="scrollToSection('orders-section')" 
        class="hover:text-blue-500 whitespace-nowrap" 
        :class="{'text-blue-500': activeSection === 'orders-section'}"
      >
        <span>Orders</span>
      </a>
      <a 
        href="#history-section" 
        @click.prevent="scrollToSection('history-section')" 
        class="hover:text-blue-500 whitespace-nowrap" 
        :class="{'text-blue-500': activeSection === 'history-section'}"
      >
        <span>History</span>
      </a>
    </div>
    
    <!-- Main content -->
    <div id="profile-section" class="w-full md:w-5/6 flex flex-col gap-6 md:gap-10 scroll-mt-20">
      <!-- Profile section -->
      <div class="w-full flex flex-col rounded-xl bg-gray-100 gap-4 p-3 md:p-5">
        <div class="w-full flex justify-between">
          <h1 class="text-xl">My Profile</h1>
          <button
            @click="logout"
            class="py-1 px-2 text-white bg-red-500 rounded-xl text-sm md:text-base"
          >
            Logout
          </button>
        </div>

        <div v-if="loading" class="py-10">
          <Loader />
        </div>

        <div v-else class="flex flex-col md:flex-row gap-4">
          <!-- Image and Edit Button -->
          <div class="w-full md:w-32 flex flex-col md:flex-col gap-2 items-center md:items-start">
            <div
              class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-400 overflow-hidden flex items-center justify-center relative group"
            >
              <img
                :src="editProfile.image_url ? editProfile.image_url : generateDefaultAvatar()"
                class="w-full h-full object-cover"
              />
              <!-- Image overlay with upload button when in edit mode -->
              <div 
                v-if="isEditing" 
                class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button 
                  @click="openImageUpload"
                  class="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  <i class="fa-solid fa-camera mr-1"></i>
                  {{ editProfile.image_url ? 'Change' : 'Upload' }}
                </button>
              </div>
              <!-- Loading indicator during image upload -->
              <div 
                v-if="isEditing && uploadingImage" 
                class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
              >
                <div class="w-8 h-8">
                  <Loader />
                </div>
              </div>
            </div>

            <div class="flex w-full gap-2 justify-center items-center">
              <button @click="toggleEdit" :disabled="savingProfile">
                <span class="py-[6px] px-2 text-white bg-red-500 rounded-xl" v-if="isEditing">Cancel</span>
                <i v-else class="fa-regular fa-pen-to-square"></i>
              </button>
              <!-- Save button when editing -->
              <div v-if="isEditing">
                <button
                  @click="saveProfile"
                  class="py-1 px-2 text-white bg-green-500 rounded-xl flex items-center gap-2"
                  :disabled="savingProfile"
                >
                  <span>{{ savingProfile ? 'Saving...' : 'Save' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              v-model="editProfile.first_name"
              :disabled="!isEditing || savingProfile"
            />
            <Input
              label="Last Name"
              v-model="editProfile.last_name"
              :disabled="!isEditing || savingProfile"
            />
            <Input label="Email" v-model="editProfile.email" disabled />
            <Input
              label="Phone Number"
              v-model="editProfile.phone_number"
              :disabled="!isEditing || savingProfile"
            />
          </div>
        </div>
      </div>

      <div id="orders-section" class="w-full flex flex-col rounded-xl bg-gray-100 gap-4 p-3 md:p-5 scroll-mt-20">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 md:gap-0">
          <h1 class="text-xl">My Orders</h1>
          <span class="text-sm text-gray-500">Showing latest 4 orders</span>
        </div>
        <div v-if="loading" class="py-10">
          <Loader />
        </div>
        <div v-else-if="latestOrders.length > 0" class="flex flex-col gap-2">
          <OderCard 
            v-for="order in latestOrders" 
            :key="order.id" 
            :order="order" 
          />
        </div>
        <div v-else class="py-8 text-center text-gray-500">
          No active orders found
        </div>
      </div>

      <div id="history-section" class="w-full flex flex-col rounded-xl bg-gray-100 gap-4 p-3 md:p-5 scroll-mt-20">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 md:gap-0">
          <h1 class="text-xl">History</h1>
          <span class="text-sm text-gray-500">Showing latest 4 orders</span>
        </div>
        <div v-if="loading" class="py-10">
          <Loader />
        </div>
        <div v-else-if="deliveredOrders.length > 0" class="flex flex-col gap-2">
          <OderCard 
            v-for="order in deliveredOrders" 
            :key="order.id" 
            :order="order" 
          />
        </div>
        <div v-else class="py-8 text-center text-gray-500">
          No order history found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Cookies from "universal-cookie";
import Input from "@/components/Input.vue";
import useAuth from "@/composable/useAuth";
import OderCard from "@/components/OderCard.vue";
import Loader from "@/components/Loader.vue";
import { useAuthStore } from "@/store/authStore";

const { logout } = useAuth();

const authStore = useAuthStore();
const profiles = ref({});
const editProfile = ref({});
const isEditing = ref(false);
const apiUrl = import.meta.env.VITE_APP_API_URL;
const orders = ref([]);
const latestOrders = ref([]);
const deliveredOrders = ref([]);
const activeSection = ref("");
const loading = ref(true);
const savingProfile = ref(false);
const uploadingImage = ref(false);
let uploadWidget = null;

const generateDefaultAvatar = () => {
  const firstName = editProfile.value?.first_name || '';
  const lastName = editProfile.value?.last_name || '';
  const email = editProfile.value?.email || '';
  const displayName = (firstName || lastName) 
    ? `${firstName} ${lastName}`.trim() 
    : (email || "User");
  let colorHash = 0;
  for (let i = 0; i < displayName.length; i++) {
    colorHash = displayName.charCodeAt(i) + ((colorHash << 5) - colorHash);
  }
  let color = (colorHash & 0x00FFFFFF).toString(16).toUpperCase();
  while (color.length < 6) {
    color = "0" + color;
  }
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${color}&color=fff&size=128&bold=true`;
};

const profile = async () => {
  loading.value = true;
  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");
    const response = await axios.get(`${apiUrl}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    profiles.value = response.data.data;
    editProfile.value = { ...response.data.data }; // Initialize editable data
    
    // Update orders from the profile data
    if (response.data.data.orders && Array.isArray(response.data.data.orders)) {
      orders.value = response.data.data.orders;
      
      // Sort orders by date (most recent first), exclude DELIVERED orders, and get the 4 latest
      latestOrders.value = [...response.data.data.orders]
        .filter(order => order.processStatus !== "DELIVERED" && order.status == "PAID")
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 4);
      
      // Filter delivered orders
      deliveredOrders.value = [...response.data.data.orders]
        .filter(order => order.processStatus === "DELIVERED")
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 4);
    }
  } catch (error) {
    console.error("Profile fetch failed:", error);
  } finally {
    loading.value = false;
  }
};

const toggleEdit = () => {
  if (isEditing.value) {
    editProfile.value = { ...profiles.value }; // Reset if cancel
  }
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
  savingProfile.value = true;
  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    const dataToSend = {
      first_name: editProfile.value.first_name,
      last_name: editProfile.value.last_name,
      phone_number: editProfile.value.phone_number,
      image_url: editProfile.value.image_url,
    };

    console.log("Sending cleaned data:", dataToSend);

    await axios.put(`${apiUrl}/update-profile`, dataToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });

    profiles.value = { ...profiles.value, ...dataToSend };
    authStore.fetchProfile();
    isEditing.value = false;
  } catch (error) {
    console.error(
      "Profile update failed:",
      error.response?.data || error.message
    );
  } finally {
    savingProfile.value = false;
  }
};

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    activeSection.value = sectionId;
  }
};

const openImageUpload = () => {
  if (uploadWidget) {
    uploadingImage.value = true;
    uploadWidget.open();
  }
};

onMounted(() => {
  profile();
  
  // Initialize the upload widget if Cloudinary is available
  if (typeof window.cloudinary !== 'undefined') {
    uploadWidget = window.cloudinary.createUploadWidget(
      { 
        cloudName: "dpq5cxfaa", 
        uploadPreset: "bontub" 
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          editProfile.value.image_url = result.info.secure_url;
          uploadingImage.value = false;
        } else if (result && result.event === "close") {
          uploadingImage.value = false;
        }
      }
    );
  }
});
</script>