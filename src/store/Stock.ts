import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators'
import {
    ProductApi, Productjsonld,
    ProductStockApi, ProductStockjsonld,
    ProductLocationApi, ProductLocationjsonld,
    ProductCategoryApi, ProductCategoryjsonld,
    ProductCollectionApi, ProductCollectionjsonld, InlineObject2, InlineObject
} from '@household/api-client';
import { Helpers } from '@/lib/api';
import _ from 'lodash';
import ConsumeProduct from '@/store/Stock/ConsumeProduct.ts';
import AddProductToStock from '@/store/Stock/AddProductToStock';
import CreateProduct from '@/store/Stock/CreateProduct';
import CreateProductCollection from '@/store/Stock/CreateProductCollection';
import CreateProductCategory from "@/store/Stock/CreateProductCategory";
import CreateProductStock from "@/store/Stock/CreateProductStock";
import CreateProductLocation from "@/store/Stock/CreateProductLocation";

@Module
export default class Stock extends VuexModule {
    updated: number = 0;
    products: { [key: string]: Productjsonld } = {};
    stocks: { [key: string]: ProductStockjsonld } = {};
    locations: { [key: string]: ProductLocationjsonld } = {};
    collections: { [key: string]: ProductCollectionjsonld } = {};
    categories: { [key: string]: ProductCategoryjsonld } = {};
    lock: boolean = false;

    @MutationAction({ mutate:['updated','lock','products','stocks','locations','collections','categories'] })
    async fetchStocks() {
        return {
            lock: false,
            updated: Date.now(),
            products: await Helpers.fetchAllData(async (page: number) => {
                return (await (new ProductApi()).getProductCollection(undefined, page)).data;
            }),
            stocks: await Helpers.fetchAllData(async (page: number) => {
                return (await (new ProductStockApi()).getProductStockCollection(
                    undefined, undefined, undefined, undefined,
                    undefined, undefined, page
                )).data;
            }),
            categories: await Helpers.fetchAllData(async (page: number) => {
                return (await (new ProductCategoryApi()).getProductCategoryCollection(page)).data;
            }),
            collections: await Helpers.fetchAllData(async (page: number) => {
                return (await (new ProductCollectionApi()).getProductCollectionCollection(page)).data;
            }),
            locations: await Helpers.fetchAllData(async (page: number) => {
                return (await (new ProductLocationApi()).getProductLocationCollection(page)).data;
            }),
        };
    }

    @Mutation
    SET_STOCK_LOCK(lock: boolean) {
        this.lock = lock;
    }

    @Mutation
    REDUCE_STOCK_QUANTITY(payload: ConsumeProduct): void {
        if (payload.bestBefore !== null) {
            let quantity = (parseInt(this.stocks[payload.stockId].bestBefore[payload.bestBefore]) - payload.quantity);
            this.stocks[payload.stockId].bestBefore[payload.bestBefore] = String(quantity);

        }
        this.stocks[payload.stockId].quantity = this.stocks[payload.stockId].quantity - payload.quantity;
    }

    @Mutation
    REVERT_REDUCE_STOCK_QUANTITY(payload: ConsumeProduct) {
        if (payload.bestBefore !== null) {
            let quantity = (parseInt(this.stocks[payload.stockId].bestBefore[payload.bestBefore]) + payload.quantity);
            this.stocks[payload.stockId].bestBefore[payload.bestBefore] = String(quantity);

        }
        this.stocks[payload.stockId].quantity = this.stocks[payload.stockId].quantity + payload.quantity;
    }

    @Mutation
    SET_STOCK_PRODUCT(payload: Productjsonld): void {
        this.products[payload['@id']] = _.clone(payload);
    }

    @Mutation
    SET_STOCK_PRODUCT_COLLECTION(payload: ProductCollectionjsonld): void {
        this.collections[payload['@id']] = _.clone(payload);
    }

    @Mutation
    SET_STOCK_PRODUCT_CATEGORY(payload: ProductCategoryjsonld): void {
        this.categories[payload['@id']] = _.clone(payload);
    }

    @Mutation
    SET_STOCK_PRODUCT_STOCK(payload: ProductStockjsonld): void {
        this.stocks[payload['@id']] = _.clone(payload);
    }

    @Mutation
    SET_STOCK_PRODUCT_LOCATION(payload: ProductLocationjsonld): void {
        this.locations[payload['@id']] = _.clone(payload);
    }

    @Mutation
    ADD_PRODUCT_STOCK_QUANTITY(payload: AddProductToStock): void {
        this.stocks[payload.stock].quantity += payload.quantity;
    }

    @Mutation
    REVERT_ADD_PRODUCT_STOCK_QUANTITY(payload: AddProductToStock): void {
        this.stocks[payload.stock].quantity += payload.quantity;
    }

    @Action({ commit: 'SET_STOCK_LOCK' })
    lockStocks(): boolean {
        return true;
    }

    @Action({ commit: 'SET_STOCK_LOCK' })
    unlockStocks(): boolean {
        return false;
    }

    @Action
    stockConsumeProduct(payload: ConsumeProduct): void {
        // 1. Optimistic update. Update state, commit.
        this.context.commit('REDUCE_STOCK_QUANTITY', payload);

        // 2. Update backend data.
        (new ProductStockApi()).stockConsumeProductStockItem(
            Helpers.normalizeIri(payload.stockId),
            new class implements InlineObject2 {
                public quantity: number = payload.quantity;
                public bestBefore: string|null = payload.bestBefore
            }
        ).catch(() => {
            // 3. Revert update to stock, if API update fails.
            this.context.commit('REVERT_REDUCE_STOCK_QUANTITY', payload);
        })
    }

    @Action
    stockUpdateProduct(payload: Productjsonld): void {
        // 1. Save current state into independent local variable.
        let revertData = _.clone(this.products[payload['@id']]);

        // 2. Optimistic update. Update state, commit.
        this.context.commit('SET_STOCK_PRODUCT', payload);

        // 3. Update backend data.
        (new ProductApi()).patchProductItem(
            payload.id,
            {
                ean: payload.ean,
                name: payload.name,
                collection: payload.collection,
            }
        ).catch((/** e **/) => {
            // 4. Revert update to stock, if API update fails.
            this.context.commit('SET_STOCK_PRODUCT', revertData);
        })
    }

    @Action
    async stockRefreshProduct(productId: string): Promise<void> {
        const res: Productjsonld = (await (new ProductApi()).getProductItem(Helpers.normalizeIri(productId))).data;
        this.context.commit('SET_STOCK_PRODUCT', res);
    }

    @Action
    async stockCreateProduct(payload: CreateProduct): Promise<string> {
        const data: object = {
            name: payload.product,
            price: 0.00,
            expiring: payload.expiring,
            collection: payload.collection,
            ean: payload.ean,
            stocks: [],
        };
        const res: Productjsonld = (await (new ProductApi()).postProductCollection((data as Productjsonld))).data;
        this.context.commit('SET_STOCK_PRODUCT', res);

        return res.id;
    }

    @Action
    async stockCreateProductCollection(payload: CreateProductCollection): Promise<ProductCollectionjsonld> {
        const data: object = {
            category: payload.category,
            name: payload.name,
            products: [],
        };
        const res: ProductCollectionjsonld = (await (new ProductCollectionApi()).postProductCollectionCollection((data as ProductCollectionjsonld))).data;
        this.context.commit('SET_STOCK_PRODUCT_COLLECTION', res);

        return res;
    }

    @Action
    async stockCreateProductCategory(payload: CreateProductCategory): Promise<ProductCategoryjsonld> {
        const data: object = {
            name: payload.name,
            collections: [],
        };
        const res: ProductCategoryjsonld = (await (new ProductCategoryApi()).postProductCategoryCollection((data as ProductCategoryjsonld))).data;
        this.context.commit('SET_STOCK_PRODUCT_CATEGORY', res);

        return res;
    }

    @Action
    async stockCreateProductStock(payload: CreateProductStock): Promise<ProductStockjsonld> {
        const data: InlineObject = {
            product: payload.product,
            location: payload.location,
        };
        const res: ProductStockjsonld = (await (new ProductStockApi()).stockInitProductStockCollection(data)).data;
        this.context.commit('SET_STOCK_PRODUCT_STOCK', res);

        return res;
    }

    @Action
    async stockCreateProductLocation(payload: CreateProductLocation): Promise<ProductLocationjsonld> {
        const data: object = {
            name: payload.name
        };
        const res: ProductLocationjsonld = (await (new ProductLocationApi()).postProductLocationCollection((data as ProductLocationjsonld))).data;
        this.context.commit('SET_STOCK_PRODUCT_LOCATION', res);

        return res;
    }

    @Action
    stockAddToStock(payload: AddProductToStock): void {
        // 1. Optimistic update. Update state, commit.
        this.context.commit('ADD_PRODUCT_STOCK_QUANTITY', payload);

        // 2. Update backend data.
        (new ProductStockApi()).stockAddProductStockItem(
            Helpers.normalizeIri(payload.stock),
            {
                quantity: payload.quantity,
                price: payload.price,
                bestBefore: payload.bestBefore,
            }
        ).catch((/** e **/) => {
            // 3. Revert update to stock, if API update fails.
            this.context.commit('REVERT_ADD_PRODUCT_STOCK_QUANTITY', payload);
        })
    }

    get stockById(): (id: string) => ProductStockjsonld {
        return (id: string): ProductStockjsonld => {
            return this.stocks[id];
        }
    }

    get productByShortId(): (id: string) => Productjsonld {
        return (id: string): Productjsonld => {
            return this.products['/api/products/'+id];
        }
    }

    get stockNeedsRefresh(): boolean {
        return this.updated < 1800;
    }
}

