<template>
  <div class="w-[1152px] justify-start flex gap-10 py-10">
    <div class="w-1/6 flex flex-col gap-4 font-semibold text-lg">
      <router-link
        ><span class="hover:text-blue-500">My Profile</span></router-link
      >
      <router-link
        ><span class="hover:text-blue-500">Orders</span></router-link
      >
      <router-link
        ><span class="hover:text-blue-500">History</span></router-link
      >
    </div>
    <div class="w-full flex flex-col gap-10">
      <!-- Profile section -->
      <div class="w-full flex flex-col rounded-xl bg-gray-100 gap-4 p-5">
        <div class="w-full flex justify-between">
          <h1 class="text-xl">My Profile</h1>
          <button
            @click="logout"
            class="py-1 px-2 text-white bg-red-500 rounded-xl"
          >
            Logout
          </button>
        </div>

        <div class="flex gap-4">
          <!-- Image and Edit Button -->
          <div class="w-32 flex flex-col gap-2">
            <div
              class="w-32 h-32 rounded-full bg-blue-400 overflow-hidden flex items-center justify-center"
            >
              <img
                v-if="editProfile.image_url"
                :src="editProfile.image_url"
                class="w-full h-full object-cover"
              />
              <div v-if="isEditing" class="w-0 translate-x-[-100px]">
                <Upload v-model:uploadedImageUrl="editProfile.image_url" />
              </div>
            </div>

            <div class="flex w-full gap-2 justify-center items-center">
              <button @click="toggleEdit">
                <span class="py-[6px] px-2 text-white bg-red-500 rounded-xl" v-if="isEditing">Cancel</span>
                <i v-else class="fa-regular fa-pen-to-square"></i>
              </button>
              <!-- Save button when editing -->
              <div v-if="isEditing">
                <button
                  @click="saveProfile"
                  class="py-1 px-2 text-white bg-green-500 rounded-xl"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="w-full grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              v-model="editProfile.first_name"
              :disabled="!isEditing"
            />
            <Input
              label="Last Name"
              v-model="editProfile.last_name"
              :disabled="!isEditing"
            />
            <Input label="Email" v-model="editProfile.email" disabled />
            <Input
              label="Phone Number"
              v-model="editProfile.phone_number"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col rounded-xl bg-gray-100 gap-4 p-5">
        <h1 class="text-xl">My Orders</h1>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span>Order #12345</span>
            <span class="text-green-500">Completed</span>
          </div>
          <div class="flex justify-between items-center">
            <span>Order #67890</span>
            <span class="text-red-500">Pending</span>
          </div>
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
import Upload from "@/components/Upload.vue";
import useAuth from "@/composable/useAuth";

const { logout } = useAuth();

const profiles = ref({});
const editProfile = ref({});
const isEditing = ref(false);
const apiUrl = import.meta.env.VITE_APP_API_URL;

const profile = async () => {
  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");
    const response = await axios.get(`${apiUrl}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    profiles.value = response.data.data;
    editProfile.value = { ...response.data.data }; // Initialize editable data
  } catch (error) {
    console.error("Profile fetch failed:", error);
  }
};

const toggleEdit = () => {
  if (isEditing.value) {
    editProfile.value = { ...profiles.value }; // Reset if cancel
  }
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
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
    isEditing.value = false;
  } catch (error) {
    console.error(
      "Profile update failed:",
      error.response?.data || error.message
    );
  }
};

onMounted(() => {
  profile();
});
</script>
