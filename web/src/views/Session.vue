<template>
    <div class="sm:m-4 m-2">
        <ProductTypes v-for="productType in productStore.productTypes"
                      :key="productType.id"
                      :product-type="productType"/>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductTypes from '../components/session/ProductTypes.vue';
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
