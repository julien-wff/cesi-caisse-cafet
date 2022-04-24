export interface Pack {
    id: string;
    name: string;
    requiredProductTypes: PackRequiredProductType[];
    baseSellPrice: number;
    productCategoryPriceRef: PackProductCategoryPriceRef | null;
    excludedProducts: ExcludedProduct[];
    minimumProductCount: number | null;
    maximumProductCount: number | null;
}

export interface PackRequiredProductType {
    id: string;
    name: string;
}

export interface PackProductCategoryPriceRef {
    id: string;
    name: string;
}

export interface ExcludedProduct {
    id: string;
    name: string;
}
