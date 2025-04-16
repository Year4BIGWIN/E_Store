<template>
  <div class="w-[1152px] justify-start flex gap-10 py-10">
    <div class="w-1/6 flex flex-col gap-4 font-semibold text-lg">
      <router-link
        ><span class="hover:text-blue-500">My Profile</span></router-link
      >
      <router-link
        ><span class="hover:text-blue-500">Pending Orders</span></router-link
      >
      <router-link
        ><span class="hover:text-blue-500">History</span></router-link
      >
    </div>
    <div class="w-full flex flex-col gap-10">
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
        <div class="w-full flex justify-between gap-4">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
              <div
                class="w-32 h-32 rounded-full bg-blue-400 overflow-hidden flex items-center justify-center"
              >
                <img
                  v-if="editProfile.image_url"
                  :src="editProfile.image_url"
                  class="w-full h-full object-cover"
                />
              </div >
              <div v-if="isEditing" class=" w-0 translate-x-[-30px]">
              <Upload v-model:uploadedImageUrl="editProfile.image_url"  />

              </div>
            </div>

            <button @click="toggleEdit">
              <i class="fa-regular fa-pen-to-square"></i>
              {{ isEditing ? "Cancel" : "Edit" }}
            </button>
          </div>
          <div class="w-full">
            <div class="w-full grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                v-model="editProfile.first_name"
                :disabled="!isEditing"
                input-class="bg-gray-300"
              />
              <Input
                label="Last Name"
                v-model="editProfile.last_name"
                :disabled="!isEditing"
                input-class="bg-gray-300"
              />
              <Input
                label="Email"
                v-model="editProfile.email"
                :disabled="!isEditing"
                input-class="bg-gray-300"
              />
              <Input
                label="Phone Number"
                v-model="editProfile.phone_number"
                :disabled="!isEditing"
                input-class="bg-gray-300"
              />
            </div>
            <div class="w-full flex justify-end mt-4" v-if="isEditing">
              <button
                @click="saveProfile"
                class="py-1 px-3 text-white bg-green-500 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col rounded-xl bg-gray-100 gap-4 p-5">
        <div class="w-full flex justify-between">
          <h1 class="text-xl">Address</h1>
          <button @click="toggleEdit">
            <i class="fa-regular fa-pen-to-square"></i>
            {{ isEditing ? "Cancel" : "Edit" }}
          </button>
        </div>
        <div class="w-full grid grid-cols-2 gap-4">
          <Input
            label="House No"
            v-model="editProfile.house_number"
            :disabled="!isEditing"
            input-class="bg-gray-100"
          />
          <Input
            label="Street No"
            v-model="editProfile.street"
            :disabled="!isEditing"
            input-class="bg-gray-100"
          />
          <Input
            label="Village"
            v-model="editProfile.village"
            :disabled="!isEditing"
            input-class="bg-gray-100"
          />
          <Input
            label="District"
            v-model="editProfile.district"
            :disabled="!isEditing"
            input-class="bg-gray-100"
          />
          <Input
            label="City/Province"
            v-model="editProfile.city"
            :disabled="!isEditing"
            input-class="bg-gray-100"
          />
          <Input
            label="Zip Code"
            v-model="editProfile.zip_code"
            :disabled="!isEditing"
            input-class="bg-gray-100"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import useAuth from "@/composable/useAuth";
import Input from "@/components/Input.vue";
import Cookies from "universal-cookie";
import Upload from "@/components/Upload.vue";

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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    profiles.value = response.data.data;
    editProfile.value = { ...response.data.data }; // Clone the profile for editing
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
    await axios.put(`${apiUrl}/update-profile`, editProfile.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    profiles.value = { ...editProfile.value }; // Update displayed data
    isEditing.value = false;
  } catch (error) {
    console.error("Profile update failed:", error);
  }
};

onMounted(() => {
  profile();
});
</script>
