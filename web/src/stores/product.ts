import { defineStore } from 'pinia';
import { handleGQLError } from '@/api/client';
import { getProductsByTypes } from '@/api/products/getProductsByTypes';
import { Product, ProductType } from '@/types/product';

export const useProductStore = defineStore('product', {
    state: () => ({
        productTypes: [] as ProductType[],
    }),
    getters: {
        products: (state) => state.productTypes.reduce(
            (products, type) => [ ...products, ...type.product ],
            [] as Product[],
        ),
    },
    actions: {
        async fetchProducts() {
            try {
                const { product_type } = await getProductsByTypes();
                this.productTypes = product_type;
            } catch (e) {
                throw handleGQLError(e);
            }
        },
    },
});
