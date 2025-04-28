<template>
  <main class="h-full w-full">
    <h1 class="text-3xl font-bold mb-6">User Management</h1>
    
    <!-- User List -->
    <div class="w-full flex flex-col gap-4">
      <!-- Loading skeleton -->
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="w-full flex justify-between items-center bg-white p-4 rounded-lg animate-pulse">
          <div class="flex gap-4 items-center">
            <div class="w-12 h-12 rounded-full bg-gray-200"></div>
            <div>
              <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="h-10 w-16 bg-gray-200 rounded-lg"></div>
            <div class="h-10 w-16 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </template>
      
      <!-- Actual user list -->
      <div v-else class="w-full flex flex-col gap-4">
        <div v-for="user in users" :key="user.id" class="w-full flex justify-between items-center bg-white p-4 rounded-lg">
          <div class="flex gap-4 items-center">
            <img :src="user.avatar" class="w-12 h-12 object-cover rounded-full" :alt="user.name">
            <div>
              <h3 class="text-lg font-semibold">{{ user.name }}</h3>
              <p class="text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <div class="flex gap-4">
            <button @click="editUser(user)" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Edit</button>
            <button @click="deleteUser(user.id)" class="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="editMode" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 class="text-2xl font-bold mb-4">Edit User</h2>
        <div class="mb-4">
          <label class="block text-gray-700">Name</label>
          <input v-model="selectedUser.first_name" class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="selectedUser.email" class="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div class="flex justify-end gap-4">
          <button @click="editMode = false" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
          <button @click="updateUser" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Cookies from 'universal-cookie';

const users = ref([]);
const newUser = ref({ name: '', email: '' });
const selectedUser = ref(null);
const apiUrl = import.meta.env.VITE_APP_API_URL;
const editMode = ref(false);
const isLoading = ref(true); // Add loading state

const fetchUsers = async () => {
  isLoading.value = true; // Set loading to true
  try {
    const cookies = new Cookies();
    const token = cookies.get('auth_token');

    const response = await fetch(`${apiUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    users.value = data.data;
  } catch (err) {
    console.error("API Error:", err);
  } finally {
    // Add small delay for smoother transition
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
};

const addUser = async () => {
  try {
    const cookies = new Cookies();
    const token = cookies.get('auth_token');

    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser.value)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const addedUser = await response.json();
    users.value.push(addedUser);
    newUser.value = { name: '', email: '' };
  } catch (err) {
    console.error("API Error:", err);
  }
};

const editUser = (user) => {
  selectedUser.value = { ...user };
  editMode.value = true;
};

const updateUser = async () => {
  try {
    const cookies = new Cookies();
    const token = cookies.get('auth_token');

    const response = await fetch(`${apiUrl}/user/${selectedUser.value.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedUser.value)
    });

    if (response !== "200") {
      throw new Error('Network response was not ok');
    }

    const updatedUser = await response.json();
    const index = users.value.findIndex(user => user.id === updatedUser.id);
    users.value[index] = updatedUser;
    editMode.value = false;
  } catch (err) {
    console.error("API Error:", err);
  }
};

const deleteUser = async (id) => {
  try {
    const cookies = new Cookies();
    const token = cookies.get('auth_token');

    const response = await fetch(`${apiUrl}/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status !== "200") {
      throw new Error('Network response was not ok');
    }
    users.value = users.value.filter(user => user.id !== id);
  } catch (err) {
    console.error("API Error:", err);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>