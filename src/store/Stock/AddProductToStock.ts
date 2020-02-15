export default interface AddProductToStock {
    /**
     * @type {string}
     */
    stock: string;
    /**
     * YYYY-MM-DD date or null, if product is set not expiring.
     * @type {string|null}
     */
    bestBefore: string|null;
    /**
     * @type {number}
     */
    quantity: number;
    /**
     * @type {number}
     */
    price: number;
}
