<template>
    <div class="bg-primary w-full h-24 p-8 flex items-center justify-between text-primary-content">
        <h2>Total : {{ totalPrice }}</h2>
        <button
            :class="{'btn': true, 'btn-secondary': true, 'no-animation': sellStore.totalPrice <= 0}"
            @click="sellStore.totalPrice > 0 && (showCheckoutModal = true)">
            Valider
            <DoubleArrow class="ml-3 w-5 h-5" fill="#FFF"/>
        </button>
    </div>

    <CheckoutModal :show-checkout-modal="showCheckoutModal" @close="showCheckoutModal = false"/>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useSellStore } from '@/stores/sell';
import { currencyFormat } from '@/utils/currency';
import DoubleArrow from '@/components/icons/DoubleArrow.vue';
import CheckoutModal from './checkout-modal/CheckoutModal.vue';

const sellStore = useSellStore();

const showCheckoutModal = ref(false);

const totalPrice = computed(() => currencyFormat.format(sellStore.totalPrice));

watch([ sellStore ], () => {
    if (sellStore.itemsCount === 0 && showCheckoutModal.value)
        showCheckoutModal.value = false;
});
</script>
