<template>
    <div v-if="showDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-5 rounded-md w-[700px] flex gap-6">
            <div class="w-1/2">
                <h2 class="text-xl font-bold mb-4">Brand Image</h2>
                <Upload :uploadedImageUrl="formData.image_url" @update:uploadedImageUrl="formData.image_url = $event" 
                class="h-64 w-full border-2 border-dashed rounded-lg flex items-center justify-center" />
            </div>
            <div class="w-1/2">
                <form @submit.prevent="handleSubmit">
                    <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit Brand' : 'Add Brand' }}</h2>
                    <div class="w-full grid grid-cols-2 gap-2">
                        <Input label="Brand Name :" v-model="formData.brand" required />
                        <Input label="Brand Description :" v-model="formData.description" required />
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
import { ref, defineProps, defineEmits, watch } from 'vue';
import Input from '@/components/Input.vue';
import Upload from '@/components/Upload.vue';
import axios from 'axios';
import Cookies from 'universal-cookie'; 

const token = new Cookies().get("auth_token");
const apiUrl = import.meta.env.VITE_APP_API_URL;
const props = defineProps({ 
    showDialog: Boolean,
    isEditMode: {
        type: Boolean,
        default: false
    },
    currentBrand: {
        type: Object,
        default: () => ({})
    }
});
const emit = defineEmits(["update:showDialog", "postsuccess", "updatesuccess"]);

const formData = ref({
  brand: '',
  description: '',
  image_url: '',
});

const isSubmitting = ref(false);
const message = ref('');
const isSuccess = ref(false);

// Reset form when dialog opens or closes
watch(() => props.showDialog, (newVal) => {
    if (newVal) {
        // If edit mode and we have currentBrand data, populate the form
        if (props.isEditMode && props.currentBrand) {
            formData.value = {
                brand: props.currentBrand.name || '',
                description: props.currentBrand.description || '',
                image_url: props.currentBrand.image_url || '',
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
        brand: '',
        description: '',
        image_url: '',
    };
}

async function handleSubmit() {
    isSubmitting.value = true;
    message.value = '';
    
    try {
        if (!formData.value.brand) {
            message.value = "Please fill all required fields";
            isSuccess.value = false;
            isSubmitting.value = false;
            return;
        }

        if (props.isEditMode) {
            // Update existing brand
            const response = await axios.put(
                `${apiUrl}/brand/${props.currentBrand.id}`, 
                {
                    name: formData.value.brand,
                    description: formData.value.description,
                    image_url: formData.value.image_url
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
            const response = await axios.post(`${apiUrl}/brand`, {
                
                name: formData.value.brand,
                description: formData.value.description,
                image_url: formData.value.image_url
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