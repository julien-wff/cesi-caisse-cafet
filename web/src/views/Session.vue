<template>
    <div class="flex flex-col h-full">
        <div class="sm:px-4 px-2 pb-6 flex-1 overflow-auto">
            <ProductTypes v-for="productType in productStore.productTypes"
                          :key="productType.id"
                          :product-type="productType"/>
        </div>

        <CheckoutBar/>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CheckoutBar from '@/components/session/CheckoutBar.vue';
import ProductTypes from '@/components/session/ProductTypes.vue';
import { useProductStore } from '@/stores/product';
import { useSessionsStore } from '@/stores/sessions';

const sessionsStore = useSessionsStore();
const productStore = useProductStore();
const router = useRouter();

onMounted(() => {
    if (!sessionsStore.currentSession)
        router.push('/');
    productStore.fetchProducts();
});
</script>
