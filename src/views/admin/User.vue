<template>
  <main class="h-full w-full bg-gray-100 p-6">
    <!-- Header section with improved styling -->
    <div
      class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
        <p class="text-gray-500 mt-1">Manage user accounts and permissions</p>
      </div>

      <!-- Enhanced search and filter section -->
      <div class="flex gap-3 md:w-1/3">
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- User List with enhanced card styling -->
    <div
      class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
    >
      <!-- Improved loading skeleton -->
      <template v-if="isLoading">
        <div
          v-for="i in 5"
          :key="i"
          class="flex justify-between items-center p-6 border-b border-gray-100 animate-pulse"
        >
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

      <!-- Enhanced empty state -->
      <div
        v-else-if="filteredUsers.length === 0"
        class="py-16 flex flex-col items-center justify-center text-gray-500"
      >
        <div class="bg-gray-50 p-6 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <p class="text-lg font-medium text-gray-700">No users found</p>
        <p class="text-sm mt-1 max-w-sm text-center">
          {{
            searchQuery
              ? "Try a different search term or clear filters"
              : "Add users to get started with user management"
          }}
        </p>
        <button
          class="mt-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg transition text-sm font-medium"
        >
          {{ searchQuery ? "Clear Search" : "Add First User" }}
        </button>
      </div>

      <!-- Enhanced user list with better cards -->
      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="flex justify-between items-center p-5 hover:bg-gray-50 transition-all group"
        >
          <div class="flex gap-5 items-center">
            <div class="relative">
              <img
                :src="user.image_url || generateDefaultAvatar(user.name)"
                class="w-14 h-14 object-cover rounded-full border-2 border-gray-200 group-hover:border-indigo-200 transition-all"
                :alt="user.name"
                @error="onImageError($event)"
              />
              <div
                class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white"
              ></div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                {{ user.name }}
              </h3>
              <div class="flex items-center gap-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p class="text-sm">{{ user.email }}</p>
              </div>
              <!-- Add role badge -->
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-2"
              >
                {{ user.role || "User" }}
              </span>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="editUser(user)"
              class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              @click="confirmDelete(user)"
              class="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium shadow-sm"
              :disabled="isDeleting === user.id"
            >
              <svg
                v-if="isDeleting !== user.id"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <svg
                v-else
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isDeleting === user.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Enhanced Edit User Modal -->
    <div
      v-if="editMode"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 p-4"
    >
      <div
        class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Edit User</h2>
          <button
            @click="editMode = false"
            class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- User avatar in edit modal -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <img
              :src="selectedUser?.image_url"
              @error="onImageError($event)"
              :alt="selectedUser?.name || 'User'"
              class="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
            />
            <button
              class="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Enhanced form fields -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2 font-medium"
              >First Name</label
            >
            <input
              v-model="selectedUser.first_name"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2 font-medium"
              >Last Name</label
            >
            <input
              v-model="selectedUser.last_name"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              v-model="selectedUser.email"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2 font-medium">Role</label>
            <select
              v-model="selectedUser.role"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
            >
              <option disabled value="">Select a role</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p class="text-sm text-gray-500 mt-1">
              Current role: {{ selectedUser.role || "Not set" }}
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-8">
          <button
            @click="editMode = false"
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg transition font-medium"
          >
            Cancel
          </button>
          <button
            @click="updateUser"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition shadow-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 p-4"
    >
      <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div class="text-center mb-6">
          <div
            class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Delete User?</h3>
          <p
            class="text-gray-600 mt-3 text-sm leading-relaxed max-w-xs mx-auto"
          >
            You're about to delete
            <span class="font-semibold">{{ userToDelete?.name }}</span
            >. This action cannot be undone and all associated data will be
            permanently removed.
          </p>
        </div>
        <div class="flex justify-center gap-4">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg transition font-medium text-sm"
          >
            Cancel
          </button>
          <button
            @click="proceedWithDelete"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition shadow-sm font-medium text-sm"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Cookies from "universal-cookie";
import { toast } from "vue3-toastify";

const users = ref([]);
const selectedUser = ref(null);
const apiUrl = import.meta.env.VITE_APP_API_URL;
const isLoading = ref(true);
const editMode = ref(false);
const showDeleteConfirm = ref(false);
const userToDelete = ref(null);
const isDeleting = ref(null);
const searchQuery = ref("");

// Filtered users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  const query = searchQuery.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
  );
});

const generateDefaultAvatar = (name) => {
  const displayName = name || "User";
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=${randomColor}&color=fff&size=128&bold=true`;
};

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    const response = await fetch(`${apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
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
  selectedUser.value = {
    ...user,
    role: user.role || "USER",
  };
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
  } catch (error) {
    console.error("Delete operation failed:", error);
    // Optionally add user notification here
  } finally {
    isDeleting.value = null;
    userToDelete.value = null;
  }
};

const deleteUser = async (id) => {
  isDeleting.value = id; // Show loading state
  showDeleteConfirm.value = false; // Close confirmation dialog

  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    // Cache the user name before attempting deletion
    const deletedUser = users.value.find((user) => user.id === id);
    const userName = deletedUser?.name || deletedUser?.email || "User";

    const response = await fetch(`${apiUrl}/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Even if we get a 500 error, we'll check if the deletion was successful by refreshing the user list
    await fetchUsers();

    // If the user is no longer in the list after refresh, consider it a success
    const userExists = users.value.some((user) => user.id === id);

    if (!userExists) {
      toast.success(`${userName} has been deleted successfully`, {
        autoClose: 3000,
      });
    } else if (!response.ok) {
      // If user still exists and response wasn't ok, then it's a real error
      throw new Error(
        `Server error (${response.status}): ${response.statusText}`
      );
    }
  } catch (err) {
    toast.error(`Failed to delete user: ${err.message}`, {
      autoClose: 5000,
    });
  } finally {
    isDeleting.value = null; // Reset loading state
  }
};

const updateUser = async () => {
  try {
    const cookies = new Cookies();
    const token = cookies.get("auth_token");
    const userId = selectedUser.value.id;
    const role = selectedUser.value.role;

    const response = await fetch(
      `${apiUrl}/update-role?userId=${userId}&role=${role}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    // Refresh user data
    await fetchUsers();
    toast.success("User role updated successfully", { autoClose: 3000 });

    editMode.value = false;
  } catch (err) {
    toast.error(`Failed to update user: ${err.message}`, { autoClose: 5000 });
  }
};

const onImageError = (event) => {
  const name = event.target.alt || "User";
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=${randomColor}&color=fff&size=128&bold=true`;
  event.target.onerror = null;
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
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
