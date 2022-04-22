<template>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/product';
import { useSessionsStore } from '../stores/sessions';

const sessionsStore = useSessionsStore();
const productStore = useProductStore();
const router = useRouter();

onMounted(() => {
    if (!sessionsStore.currentSession)
        router.push('/');
    productStore.fetchProducts();
});
</script>
