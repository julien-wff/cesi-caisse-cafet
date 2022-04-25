<template>
    <span class="font-bold">
        Pack {{ packedSell.pack.name }} ({{ currencyFormat.format(packedSell.price) }})
    </span>
    <ul class="mb-4">
        <li v-for="{product, quantity} in packedSell.sells" :key="product.id">
            <ProductDisplay :product="product" :quantity="quantity" packed/>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import ProductDisplay from '@/components/session/checkout-modal/ProductDisplay.vue';
import { PackedSell } from '@/composables/useProductPacking';
import { currencyFormat } from '@/utils/currency';

defineProps<{
    packedSell: PackedSell
}>();
</script>
