import { SellProduct } from '@/stores/sell';
import { Pack } from '@/types/pack';
import { Product } from '@/types/product';

export function useProductPacking(sells: SellProduct[], packs: Pack[]) {
    // Clone the sells object to clear reference and avoid mutation on the original object
    sells = JSON.parse(JSON.stringify(sells));
    // Try to see if some items fit in a pack
    return {
        packedSells: packProducts(sells, packs, []),
        remainingProducts: sells,
    };
}

function packProducts(sells: SellProduct[], packs: Pack[], packedSells: PackedSell[]): PackedSell[] {
    // Try to get a pack that meets the requirements
    for (const pack of packs) {
        // Try to get all the products that can fit into the pack
        let matchingSells: SellProduct[] = [];
        for (const requiredProductType of pack.requiredProductTypes) {
            matchingSells = [
                ...matchingSells,
                ...sells.filter(sell =>
                    sell.product.product_type.id === requiredProductType.id
                    && !pack.excludedProducts.find(excludedProduct => excludedProduct.id === sell.product.id),
                ),
            ];
        }

        // Make a list of all the uniques product types in the matching sells
        const matchedProductTypes = getProductTypesIDsFromProducts(matchingSells.map(sell => sell.product));

        // If the product types count doesn't match the pack's requirements, skip this pack
        if (matchedProductTypes.length !== pack.requiredProductTypes.length)
            continue;

        // If the product count is too low, skip this pack
        const matchingProductCount = matchingSells.reduce((count, sell) => count + sell.quantity, 0);
        if (matchingProductCount < (pack.minimumProductCount || 0))
            continue;

        // Isolating the products we keep in the pack
        let keptSells: SellProduct[] = [];
        let maxExtraProductsCount = (pack.maximumProductCount || pack.requiredProductTypes.length) - pack.requiredProductTypes.length;
        let includedProductTypesIDs: string[] = [];
        // Get all least one product of each type, and fill the rest with products of the same type
        for (const { product, quantity } of matchingSells) {
            // If we don't already have the product type, keep it
            if (!includedProductTypesIDs.includes(product.product_type.id)) {
                // If we can take extra products of this type, do it
                if (maxExtraProductsCount > 0) {
                    // Don't take more than the selected quantity or the extras + 1 (+1 because we want to take at least one)
                    const includeCount = Math.min(quantity, maxExtraProductsCount + 1);
                    keptSells.push({ product, quantity: includeCount });
                    // Update the extras count (-1 because we had to take at least one)
                    maxExtraProductsCount -= includeCount - 1;
                } else {
                    keptSells.push({ product, quantity: 1 });
                }
                includedProductTypesIDs.push(product.product_type.id);
                // Pick products of the same type because there is extras available
            } else if (maxExtraProductsCount > 0) {
                const includeCount = Math.min(quantity, maxExtraProductsCount);
                keptSells.push({ product, quantity: includeCount });
                maxExtraProductsCount -= includeCount;
            }
        }

        // Removing the sells that are in a pack from the sells list
        // Cloning the sells is required because the array is modified inside the loop
        for (const sell of [ ...sells ]) {
            const packedSell = keptSells.find(keptSells => keptSells.product.id === sell.product.id);
            // If the sell is not in the pack, skip it
            if (!packedSell)
                continue;
            if (packedSell.quantity === sell.quantity) {
                // If the sell has the same quantity, remove it
                sells.splice(sells.indexOf(sell), 1);
            } else {
                // If the sell has a different quantity, update it
                sell.quantity -= packedSell.quantity;
            }
        }

        // Calculating the price of the pack
        let packPrice = 0;
        if (pack.productCategoryPriceRef) {
            // If the pack price is based on a product category price, get the price of all the products from the category
            // and add it to the pack base price
            packPrice = keptSells
                    .filter(sell => sell.product.product_type.id === pack.productCategoryPriceRef?.id)
                    .reduce(
                        (price, { product, quantity }) => price + (product.sell_price * quantity),
                        0,
                    )
                + pack.baseSellPrice;
        } else {
            packPrice = pack.baseSellPrice;
        }

        packedSells.push({
            sells: keptSells,
            pack,
            price: packPrice,
        });

        return packProducts(sells, packs, packedSells);
    }

    // If there are no more matching packs, return the packed sells
    return packedSells;
}

export const getProductTypesIDsFromProducts = (products: Product[]) => [
    ...products.reduce(
        (types, product) => types.add(product.product_type.id),
        new Set<string>(),
    ),
];

export interface PackedSell {
    sells: SellProduct[];
    pack: Pack;
    price: number;
}
