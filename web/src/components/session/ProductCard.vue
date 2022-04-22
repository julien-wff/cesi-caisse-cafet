<template>
    <div class="card card-compact w-full bg-base-100 cursor-pointer select-none">
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
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { ENDPOINT } from '../../api/client';
import { Product } from '../../types/product';
import { currencyFormat } from '../../utils/currency';

const props = defineProps<{
    product: Product,
}>();

const productPrice = computed(() => {
    return currencyFormat.format(props.product.sell_price);
});
</script>
