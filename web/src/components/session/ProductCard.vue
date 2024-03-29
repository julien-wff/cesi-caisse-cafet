<template>
    <ProductCardIndicator :product="product">
        <div class="card card-compact w-full bg-base-100 cursor-pointer select-none"
             :class="productOutOfStock ? 'outline outline-1 outline-error' : ''"
             @click="handleProductClick">
            <figure v-if="product.thumbnail">
                <img :alt="product.name"
                     :height="product.thumbnail.height"
                     :src="ENDPOINT + '/assets/' + product.thumbnail.id"
                     :width="product.thumbnail.width">
            </figure>
            <div class="card-body">
                <h3 class="card-title">
                    <span class="sm:text-xl text-lg">{{ product.name }}</span>
                </h3>
                <p>
                    {{ productPrice }}
                </p>
            </div>
        </div>
    </ProductCardIndicator>
</template>

<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import { computed } from 'vue';
import { ENDPOINT } from '@/api/client';
import { useSellStore } from '@/stores/sell';
import { Product } from '@/types/product';
import { currencyFormat } from '@/utils/currency';
import ProductCardIndicator from './ProductCardIndicator.vue';

const sellStore = useSellStore();
const toast = useToast();

const props = defineProps<{
    product: Product,
}>();

const productPrice = computed(() => {
    return currencyFormat.format(props.product.sell_price);
});

const productOutOfStock = computed(() => {
    return props.product.stock_management_enabled
        && (props.product.stock <= 0 || sellStore.productCount(props.product) > props.product.stock);
});

function handleProductClick() {
    const productCount = sellStore.productCount(props.product);

    if (props.product.stock_management_enabled && props.product.stock <= productCount)
        toast.error(`${props.product.stock} en stock`, { duration: 2000 });

    if (productCount > 0) {
        sellStore.addQuantity(props.product, 1);
    } else {
        sellStore.addToCart(props.product);
    }
}
</script>
