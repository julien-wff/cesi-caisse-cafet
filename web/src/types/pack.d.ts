export interface Pack {
    id: string;
    name: string;
    requiredProductTypes: PackRequiredProductType[];
    baseSellPrice: number;
    productPriceRef: PackProductPriceRef | null;
    excludedProducts: ExcludedProduct[];
    minimumProductCount: number | null;
    maximumProductCount: number | null;
}

export interface PackRequiredProductType {
    id: string;
    name: string;
}

export interface PackProductPriceRef {
    id: string;
    name: string;
    sellPrice: number;
}

export interface ExcludedProduct {
    id: string;
    name: string;
}
