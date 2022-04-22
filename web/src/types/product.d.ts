export interface Product {
    id: string;
    name: string;
    product_type: {
        id: string;
        name: string;
    };
    buy_price: number;
    sell_price: number;
    thumbnail?: {
        id: string;
        height: number;
        width: number;
    };
}

export interface ProductType {
    id: string;
    name: string;
    product: Product[];
}
