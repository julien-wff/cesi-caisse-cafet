<template>
    <div :class="{'modal': true, 'modal-open': showCheckoutModal}" @click.self="!loading && $emit('close')">
        <div class="modal-box relative">
            <div class="btn btn-sm btn-circle absolute right-2 top-2" @click="!loading && $emit('close')">✕</div>
            <h3 class="text-lg font-bold">
                Confirmation de la vente ({{ currencyFormat.format(sellStore.totalPrice) }})
            </h3>

            <div class="pt-4 pb-2">
                <ul>
                    <li v-for="{ product, quantity } in sellStore.cart" :key="product.id" class="mb-2">
                        <ProductDisplay :product="product" :quantity="quantity"/>
                    </li>
                </ul>
                <p v-if="sellStore.discount > 0">
                    Réductions : {{ sellStore.packCount }}x {{ currencyFormat.format(DISCOUNT_VALUE) }}
                </p>
            </div>

            <div class="form-control pb-2" v-if="sellStore.itemsCount <= MAX_PRODUCT_COUNT_FOR_OPENING_REDUCTION">
                <label class="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" v-model="openingReduction" class="checkbox checkbox-primary"/>
                    <span class="label-text">Offert pour l'ouverture</span>
                </label>
            </div>

            <p v-if="error" class="my-4 text-error font-bold">{{ error }}</p>

            <button :disabled="loading"
                    class="btn w-full mt-2"
                    @click="handleValidatingClick"
                    :class="{'btn-primary': !openingReduction, 'btn-accent': openingReduction}">
                Valider
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ProductDisplay from '@/components/session/checkout-modal/ProductDisplay.vue';
import { useSellStore, DISCOUNT_VALUE } from '@/stores/sell';
import { ref, watch } from 'vue';
import { currencyFormat } from '@/utils/currency';

const MAX_PRODUCT_COUNT_FOR_OPENING_REDUCTION = 2;

const sellStore = useSellStore();

const loading = ref(false);
const error = ref<string | null>(null);
const openingReduction = ref(false);

const emit = defineEmits<{
    (e: 'close'): void,
}>();

const props = defineProps<{
    showCheckoutModal: boolean,
}>();

function handleValidatingClick() {
    loading.value = true;
    error.value = null;
    sellStore.confirmSell(openingReduction.value)
        .then(() => emit('close'))
        .catch(e => error.value = e.message)
        .finally(() => loading.value = false);
}

// Reset opening reduction if there is too many products in the cart
watch(sellStore.cart, () => {
    if (sellStore.itemsCount > MAX_PRODUCT_COUNT_FOR_OPENING_REDUCTION && openingReduction.value)
        openingReduction.value = false;
});

// Resets when opening the modal
watch(props, () => {
    if (props.showCheckoutModal && error.value)
        error.value = null;
    if (props.showCheckoutModal && openingReduction.value)
        openingReduction.value = false;
});
</script>
