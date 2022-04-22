import { defineStore } from 'pinia';
import { Product } from '../types/product';

interface SellProduct {
    product: Product;
    quantity: number;
}

export const useSellStore = defineStore('sell', {
    state: () => ({
        cart: [] as SellProduct[],
    }),
    getters: {
        totalPrice(store) {
            return store.cart.reduce(
                (total, { product, quantity }) => total + product.sell_price * quantity,
                0,
            );
        },
        itemsCount(store) {
            return store.cart.reduce((total, { quantity }) => total + quantity, 0);
        },
        productCount(store) {
            return (product: Product) => {
                return store.cart.find(({ product: p }) => p.id === product.id)?.quantity || 0;
            };
        },
    },
    actions: {
        addToCart(product: Product, quantity = 1) {
            this.cart.push({ product, quantity });
        },
        removeFromCart(product: Product) {
            this.cart = this.cart.filter(({ product: p }) => p !== product);
        },
        addQuantity(product: Product, quantity: number) {
            const index = this.cart.findIndex(({ product: p }) => p.id === product.id);
            if (index === -1)
                return;
            const newQuantity = this.cart[index].quantity + quantity;
            if (newQuantity <= 0)
                this.removeFromCart(product);
            else
                this.cart[index].quantity = newQuantity;
        },
        confirmSell() {
            console.table([ ...this.cart.map(({ quantity, product }) => ({ quantity, product: product.name })) ]);
            this.$reset();
        },
    },
});
