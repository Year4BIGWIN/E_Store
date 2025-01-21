<template>
    
    <Upload :uploadedImageUrl="uploadedImageUrl" @update:uploadedImageUrl="uploadedImageUrl = $event" />
    
</template>
<script setup>
import Upload from '../../components/Upload.vue';
</script>
