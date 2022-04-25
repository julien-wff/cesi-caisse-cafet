<template>
    <div class="flex justify-between items-center">
        <span :class="{ 'font-bold': !packed }">
            {{ quantity }}x {{ product.name }}
            <span v-if="!packed">({{ currencyFormat.format(product.sell_price * quantity) }})</span>
        </span>
        <button class="btn btn-circle btn-xs btn-error scale-[.85] no-animation"
                @click="sellStore.addQuantity(product, -1)">
            ✕
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useSellStore } from '@/stores/sell';
import { Product } from '@/types/product';
import { currencyFormat } from '@/utils/currency';

const sellStore = useSellStore();

defineProps<{
    product: Product,
    quantity: number,
    packed?: boolean, // If the product is inside a pack or not
}>();
</script>
