<template>
  <main class="h-full w-full">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">User Management</h1>
      
      <!-- Search and filter section -->
      <div class="flex gap-3">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search users..." 
            class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button @click="fetchUsers" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
    
    <!-- User List -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- Loading skeleton -->
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="flex justify-between items-center p-5 border-b border-gray-100 animate-pulse">
          <div class="flex gap-4 items-center">
            <div class="w-12 h-12 rounded-full bg-gray-200"></div>
            <div>
              <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="h-9 w-20 bg-gray-200 rounded-lg"></div>
            <div class="h-9 w-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </template>
      
      <!-- Empty state -->
      <div v-else-if="filteredUsers.length === 0" class="py-12 flex flex-col items-center justify-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="text-lg font-medium">No users found</p>
        <p class="text-sm mt-1">{{searchQuery ? 'Try a different search term' : 'Add users to get started'}}</p>
      </div>
      
      <!-- Actual user list -->
      <div v-else class="divide-y divide-gray-100">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          class="flex justify-between items-center p-4 hover:bg-gray-50 transition"
        >
          <div class="flex gap-4 items-center">
            <div class="relative">
              <img 
                :src="user.image_url" 
                class="w-12 h-12 object-cover rounded-full border border-gray-200" 
                :alt="user.name"
                @error="onImageError($event)"
              />
              <div class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white"></div>
            </div>
            <div>
              <h3 class="text-lg font-semibold">{{ user.name }}</h3>
              <p class="text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button 
              @click="editUser(user)" 
              class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button 
              @click="confirmDelete(user)" 
              class="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition flex items-center gap-1"
              :disabled="isDeleting === user.id"
            >
              <svg v-if="isDeleting !== user.id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDeleting === user.id ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Pagination controls -->
      <div class="p-4 flex justify-between items-center bg-gray-50">
        <span class="text-sm text-gray-600">Showing {{ filteredUsers.length }} of {{ users.length }} users</span>
        <div class="flex gap-2">
          <button class="px-3 py-1 rounded border hover:bg-gray-100 transition text-sm disabled:opacity-50" disabled>Previous</button>
          <button class="px-3 py-1 rounded border hover:bg-gray-100 transition text-sm disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="editMode" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Edit User</h2>
          <button @click="editMode = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2 font-medium">Name</label>
          <input 
            v-model="selectedUser.first_name" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition" 
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-2 font-medium">Email</label>
          <input 
            v-model="selectedUser.email" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition" 
          />
        </div>
        <div class="flex justify-end gap-4">
          <button 
            @click="editMode = false" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Cancel
          </button>
          <button 
            @click="updateUser" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Confirm Deletion</h3>
          <p class="text-gray-500 mt-2">Are you sure you want to delete this user? This action cannot be undone.</p>
        </div>
        <div class="flex justify-center gap-4">
          <button 
            @click="showDeleteConfirm = false" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition"
          >
            Cancel
          </button>
          <button 
            @click="proceedWithDelete" 
            class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Cookies from 'universal-cookie';

const users = ref([]);
const selectedUser = ref(null);
const apiUrl = import.meta.env.VITE_APP_API_URL;
const isLoading = ref(true);
const editMode = ref(false);
const showDeleteConfirm = ref(false);
const userToDelete = ref(null);
const isDeleting = ref(null);
const searchQuery = ref('');

// Filtered users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.name?.toLowerCase().includes(query) || 
    user.email?.toLowerCase().includes(query)
  );
});

const fetchUsers = async () => {
  isLoading.value = true;
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

const editUser = (user) => {
  selectedUser.value = { ...user };
  editMode.value = true;
};

const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteConfirm.value = true;
};

const proceedWithDelete = async () => {
  if (!userToDelete.value) return;
  
  showDeleteConfirm.value = false;
  isDeleting.value = userToDelete.value.id;
  
  try {
    await deleteUser(userToDelete.value.id);
  } finally {
    isDeleting.value = null;
    userToDelete.value = null;
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

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    users.value = users.value.filter(user => user.id !== id);
  } catch (err) {
    console.error("API Error:", err);
  }
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

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    // Update the user in the list
    const index = users.value.findIndex(u => u.id === selectedUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...selectedUser.value };
    }

    editMode.value = false;
  } catch (err) {
    console.error("API Error:", err);
  }
};

const onImageError = (event) => {
  // Fallback to a default avatar if the image fails to load
  event.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(event.target.alt) + '&background=random';
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