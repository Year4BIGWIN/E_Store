<template>
  <div class="w-[1152px] justify-start flex gap-10 py-10">
    <div class="w-1/6 flex flex-col gap-4 font-semibold text-lg">
      <router-link><span class="hover:text-blue-500">My Profile</span></router-link>
      <router-link><span class="hover:text-blue-500">Pending Orders</span></router-link>
      <router-link><span class="hover:text-blue-500">History</span></router-link>
    </div>
    <div class="w-full flex flex-col gap-10">
      <div class="w-full flex flex-col rounded-xl bg-gray-200 gap-4 p-5">
        <div class="w-full flex justify-between">
          <h1 class="text-xl">My Profile</h1>
          <button @click="logout" class="py-1 px-2 text-white bg-red-500 rounded-xl">
            Logout
          </button>
        </div>
        <div class="w-full flex justify-between gap-4">
          <div class="flex flex-col gap-2">
            <div class="w-32 h-32 rounded-full bg-blue-400"></div>
            <button>
              <i class="fa-regular fa-pen-to-square"></i>
              Edit
            </button>
          </div>
          <div class="w-full">
            <div class="w-full grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                :modelValue="profiles.first_name"
                :disabled="true"
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                :modelValue="profiles.last_name"
                :disabled="true"
              />
              <Input
                label="Email"
                placeholder="john.doe@example.com"
                :modelValue="profiles.email"
                :disabled="true"
              />
              <Input
                label="Phone Number"
                placeholder="+855 (555) 555-5555"
                :modelValue="profiles.phone"
                :disabled="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col rounded-xl bg-gray-200 gap-4 p-5">
        <div class="w-full flex justify-between">
          <h1 class="text-xl">Address</h1>
          <button>
            <i class="fa-regular fa-pen-to-square"></i>
            Edit
          </button>
        </div>
        <div class="w-full grid grid-cols-2 gap-4">
          <Input label="House No" placeholder="412" v-model="houseNo" />
          <Input label="Street No" placeholder="2004" v-model="streetNo" />
          <Input label="Village" placeholder="MeanChey" v-model="village" />
          <Input label="District" placeholder="StungMeanChey" v-model="district" />
          <Input label="City/Province" placeholder="New York" v-model="city" />
          <Input label="Zip Code" placeholder="10001" v-model="zipCode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import useAuth from '@/composable/useAuth'; // Import the composable
import Input from '@/components/Input.vue';
import Cookies from 'universal-cookie'; // Import the cookies module

const { logout } = useAuth(); // Get the logout function from the composable

const profiles = ref({});
const apiUrl = import.meta.env.VITE_APP_API_URL;

const profile = async () => {
  try {
    const cookies = new Cookies(); // Instantiate cookies
    const token = cookies.get('auth_token'); // Get the token from cookies
    const response = await axios.get(`${apiUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    profiles.value = response.data.data;
    console.log(profiles.value);
  } catch (error) {
    console.error('Profile fetch failed:', error);
  }
};

onMounted(() => {
  profile();
});
</script>


