import { ProductLocationjsonld, Productjsonld } from "@household/api-client";

export default interface CreateProductCategory {
    /**
     * @type {string}
     */
    location: ProductLocationjsonld['@id']|string;
    /**
     * @type {string}
     */
    product: Productjsonld['@id']|string;
}
