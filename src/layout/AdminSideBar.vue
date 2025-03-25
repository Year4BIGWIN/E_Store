<template>
  <div class="flex justify-between w-64">
    <!-- Sidebar -->
    <div
      :class="[
        'h-screen',
        sidebarOpen ? 'w-64' : 'w-16',
        'bg-[#d9d9d9] text-black',
        'transition-all',
      ]"
    >
      <div class="p-6 text-center flex items-center justify-between gap-2">
        <router-link v-if="sidebarOpen" to="/">
          <h1 class="text-2xl font-semibold">SmartGear</h1>
        </router-link>

        <button @click="toggleSidebar">
          <i class="fa-solid fa-bars fa-lg"></i>
        </button>
      </div>
      <ul class="space-y-4 px-4">
        <li>
          <router-link
            active-class="bg-gray-700 text-white fill-white"
            to="/dashboard"
            :class="[
              'flex',
              'hover:fill-blue-500',
              sidebarOpen
                ? 'px-4 py-2 items-center text-lg gap-2 hover:text-blue-500 rounded-md'
                : 'rounded-md px-1 py-2 justify-center transition-all',
            ]"
          >
            <svg
              height="20px"
              width="20px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"
              />
            </svg>
            <span v-if="sidebarOpen">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link
            active-class="bg-gray-700 text-white fill-white"
            to="/product"
            :class="[
              'flex',
              'hover:fill-blue-500',
              sidebarOpen
                ? 'px-4 py-2 items-center text-lg gap-2 hover:text-blue-500 rounded-md'
                : 'rounded-md p-4 justify-center transition-all',
            ]"
          >
            <i class="fa-solid fa-box fa-lg"></i>
            <span v-if="sidebarOpen">Products</span>
          </router-link>
        </li>
        <li>
          <router-link
            active-class="bg-gray-700 text-white fill-white"
            to="/order"
            :class="[
              'flex',
              'hover:fill-blue-500',
              sidebarOpen
                ? 'px-4 py-2 items-center text-lg gap-2 hover:text-blue-500 rounded-md'
                : 'rounded-md px-1 py-2 justify-center transition-all',
            ]"
          >
            <svg
              height="20px"
              id="Layer_3"
              version="1.1"
              viewBox="0 0 48 48"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M33.021,2.026V0H14.979v2.026H4V48h40V2.026H33.021z M40,42H8V6h6.979v3h18.042V6H40V42z"
                />
                <rect height="4" width="24.062" x="12" y="14.938" />
                <rect height="4" width="24.062" x="12" y="22.938" />
                <rect height="4" width="24.062" x="12" y="30.938" />
              </g>
            </svg>
            <span v-if="sidebarOpen">Orders</span>
          </router-link>
        </li>

        <li>
          <router-link
            active-class="bg-gray-700 text-white fill-white"
            to="/other"
            :class="[
              'flex',
              'hover:fill-blue-500',
              sidebarOpen
                ? 'px-4 py-2 items-center text-lg gap-2 hover:text-blue-500 rounded-md'
                : 'rounded-md px-1 py-2 justify-center transition-all',
            ]"
          >
            <svg
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <rect
                  width="48"
                  height="48"
                  fill-opacity="0.01"
                ></rect>
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke="#000000"
                  stroke-width="4"
                  stroke-linejoin="round"
                ></rect>
                <rect
                  x="4"
                  y="28"
                  width="16"
                  height="16"
                  rx="2"
                  stroke="#000000"
                  stroke-width="4"
                  stroke-linejoin="round"
                ></rect>
                <rect
                  x="28"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke="#000000"
                  stroke-width="4"
                  stroke-linejoin="round"
                ></rect>
                <path
                  d="M28 28H44"
                  stroke="#000000"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M36 36H44"
                  stroke="#000000"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M28 44H44"
                  stroke="#000000"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>

            <span v-if="sidebarOpen">Other</span>
          </router-link>
        </li>

        <li>
          <router-link
            active-class="bg-gray-700 text-white fill-white"
            to="/user"
            :class="[
              'flex',
              'hover:fill-blue-500',
              sidebarOpen
                ? 'px-4 py-2 text-lg gap-2 items-center hover:text-blue-500 rounded-md'
                : 'rounded-md p-4 justify-center transition-all',
            ]"
          >
            <i class="fa-solid fa-users fa-lg"></i>
            <span v-if="sidebarOpen">Users</span>
          </router-link>
        </li>
        <li>
          <button
            @click="handleLogout"
            :class="[
              'flex fill-white hover:fill-blue-500',
              sidebarOpen
                ? 'px-4 py-2 items-center text-lg gap-2 hover:text-blue-500 rounded-md'
                : 'rounded-md px-1 py-2 justify-center transition-all',
              'bg-red-500 text-white hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium w-full text-center',
            ]"
          >
            <svg
              height="24px"
              width="24px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z"
                />
              </g>
            </svg>
            <span v-if="sidebarOpen">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useAuth from "@/composable/useAuth"; // Import the composable

const sidebarOpen = ref(true);
const { logout } = useAuth(); // Destructure logout from useAuth composable

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleLogout = () => {
  logout(); // Call the logout function
};
</script>

<style scoped>
/* Additional styles for transition */
.transition-all {
  transition: all 0.3s ease;
}
</style>
