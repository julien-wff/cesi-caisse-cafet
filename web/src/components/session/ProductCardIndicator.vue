<template>
    <div class="indicator w-full">
        <span v-if="productCount"
              class="indicator-item badge badge-primary translate-x-1.5 -translate-y-1.5 cursor-pointer select-none"
              @click="handleBadgeClick">
            {{ productCount }}
        </span>
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useSellStore } from '../../stores/sell';
import { Product } from '../../types/product';

const sellStore = useSellStore();

const props = defineProps<{
    product: Product,
}>();

const productCount = computed(() => {
    return sellStore.productCount(props.product);
});

function handleBadgeClick() {
    sellStore.addQuantity(props.product, -1);
}
</script>
