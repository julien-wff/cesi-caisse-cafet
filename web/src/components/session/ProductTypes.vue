<template>
    <h2 class="mt-4 mb-2">{{ productType.name }}</h2>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:gap-4 gap-2">
        <ProductCard v-for="product in productType.product" :key="product.id" :product="product"/>
    </div>
</template>

<script lang="ts" setup>
import { ProductType } from '@/types/product';
import ProductCard from './ProductCard.vue';

defineProps<{
    productType: ProductType,
}>();
</script>
