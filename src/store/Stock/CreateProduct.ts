export default interface CreateProduct {
    /**
     * @type {string}
     */
    product: string;
    /**
     * @type {Array<string>}
     */
    ean: Array<string>;
    /**
     * @type {string}
     */
    collection: string;
    /**
     * @type {string}
     */
    manufacturer: string;
    /**
     * @type {boolean}
     */
    expiring: boolean;
}
