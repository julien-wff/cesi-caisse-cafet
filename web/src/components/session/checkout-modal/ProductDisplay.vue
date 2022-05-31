<template>
    <div class="flex justify-between items-center font-bold">
        <span>
            {{ quantity }}x {{ product.name }}
            ({{ currencyFormat.format(product.sell_price * quantity) }})
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
}>();
</script>
