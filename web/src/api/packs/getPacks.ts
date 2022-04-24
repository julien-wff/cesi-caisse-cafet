import { gql } from 'graphql-request';
import { Pack } from '../../types/pack';
import { GraphQLClient } from '../client';

export function getPacks() {
    return GraphQLClient.request<RawPackResponse>(gql`
        query {
            pack {
                id
                name
                required_product_type {
                    product_type_id {
                        id
                        name
                    }
                }
                base_sell_price
                product_price_ref {
                    id
                    name
                    product {
                        id
                        name
                        sell_price
                    }
                }
                excluded_product {
                    product_id {
                        id
                        name
                    }
                }
                minimum_product_count
                maximum_product_count
            }
        }
    `)
    .then(pack => ({ pack: parseRawPackResponse(pack) }));
}

export interface RawPackResponse {
    pack: {
        id: string;
        name: string;
        required_product_type: {
            product_type_id: {
                id: string;
                name: string;
            }
        }[];
        base_sell_price: number;
        product_price_ref: null | {
            id: string;
            name: string;
        };
        excluded_product: {
            product_id: {
                id: string;
                name: string;
            }
        }[];
        minimum_product_count: null | number;
        maximum_product_count: null | number;
    }[];
}

export function parseRawPackResponse(rawResponse: RawPackResponse): Pack[] {
    return rawResponse.pack.map(pack => {
        const {
            id,
            name,
            required_product_type,
            base_sell_price,
            product_price_ref,
            excluded_product,
            minimum_product_count,
            maximum_product_count,
        } = pack;

        const requiredProductTypes = required_product_type.map(({ product_type_id }) => product_type_id);
        const productCategoryPriceRef = product_price_ref ?
            {
                id: product_price_ref.id,
                name: product_price_ref.name,
            }
            : null;
        const excludedProducts = excluded_product.map(({ product_id }) => product_id);

        return {
            id,
            name,
            requiredProductTypes,
            baseSellPrice: base_sell_price,
            productCategoryPriceRef,
            excludedProducts,
            minimumProductCount: minimum_product_count,
            maximumProductCount: maximum_product_count,
        };
    });
}
