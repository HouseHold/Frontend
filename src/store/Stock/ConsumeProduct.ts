export default interface ConsumeProduct {
    /**
     * @type {string}
     */
    stockId: string;
    /**
     * YYYY-MM-DD date or null, if product is set not expiring.
     * @type {string|null}
     */
    bestBefore: string|null;
    /**
     * @type {number}
     */
    quantity: number;
}
