<template>
    <div v-if="showDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-5 rounded-md w-[400px] flex gap-6">
                <form @submit.prevent="handleSubmit">
                    <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit Category' : 'Add Category' }}</h2>
                    <div class="w-full grid grid-cols-2 gap-2">
                        <Input label="Category Name :" v-model="formData.category" required />
                        <Input label="Category Description :" v-model="formData.description" required />
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
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import Input from '@/components/Input.vue';
import axios from 'axios';
import Cookies from 'universal-cookie';

const token = new Cookies().get("auth_token");
const apiUrl = import.meta.env.VITE_APP_API_URL;

const props = defineProps({
    showDialog: Boolean,
    isEditMode: { type: Boolean, default: false },
    currentCategory: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(["update:showDialog", "postsuccess", "updatesuccess"]);

const formData = ref({
    category: '',
    description: '',
});

const isSubmitting = ref(false);
const message = ref('');
const isSuccess = ref(false);

// Reset form when dialog opens or closes
watch(() => props.showDialog, (newVal) => {
    if (newVal) {
        if (props.isEditMode && props.currentCategory) {
            formData.value = {
                category: props.currentCategory.name || '',
                description: props.currentCategory.description || '',
                id: props.currentCategory.id || null
            };
        } else {
            resetForm();
        }
    }
    message.value = '';
});

function closeDialog() {
  emit("update:showDialog", false);
}

function resetForm() {
    formData.value = {
        category: '',
        description: '',
    };
}

async function handleSubmit() {
    isSubmitting.value = true;
    message.value = '';
    
    try {
        if (!formData.value.category) {
            message.value = "Please fill all required fields";
            isSuccess.value = false;
            isSubmitting.value = false;
            return;
        }

        if (props.isEditMode) {
            if (!props.currentCategory.id) {
                message.value = "Invalid category ID";
                isSuccess.value = false;
                isSubmitting.value = false;
                return;
            }

            // Update existing brand
            const response = await axios.put(
                `${apiUrl}/productType/${props.currentCategory.id}`, 
                {
                    name: formData.value.category,
                    description: formData.value.description,
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            isSuccess.value = true;
            message.value = "Brand updated successfully!";
            emit("updatesuccess", response.data);
            
            setTimeout(() => {
                closeDialog();
            }, 1500);
        } else {
            // Create new brand
            const response = await axios.post(`${apiUrl}/productType`, {
                name: formData.value.category,
                description: formData.value.description,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            isSuccess.value = true;
            message.value = "Brand created successfully!";
            emit("postsuccess", response.data);
            resetForm();
            
            setTimeout(() => {
                closeDialog();
            }, 1500);
        }
    } catch (error) {
        console.error(error);
        isSuccess.value = false;
        message.value = "An error occurred. Please try again.";
    } finally {
        isSubmitting.value = false;
    }
}
</script>
