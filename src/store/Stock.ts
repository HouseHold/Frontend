import {Module, VuexModule, Mutation, Action, MutationAction} from 'vuex-module-decorators'
import {
    ProductApi, Productjsonld,
    ProductStockApi, ProductStockjsonld,
    ProductLocationApi, ProductLocationjsonld,
    ProductCategoryApi, ProductCategoryjsonld,
    ProductCollectionApi, ProductCollectionjsonld, InlineObject2
} from "@household/api-client";
import { Helpers } from '@/lib/api';
import ConsumeProduct from "@/store/Stock/ConsumeProduct";

@Module
export default class Stock extends VuexModule {
    updated: number = 0;
    products: { [key: string]: Productjsonld } = {};
    stocks: { [key: string]: ProductStockjsonld } = {};
    locations: { [key: string]: ProductLocationjsonld } = {};
    collections: { [key: string]: ProductCollectionjsonld } = {};
    categories: { [key: string]: ProductCategoryjsonld } = {};
    lock: boolean = false;

    @MutationAction({mutate:['updated','lock','products','stocks','locations','collections','categories']})
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
    async REVERT_REDUCE_STOCK_QUANTITY(payload: ConsumeProduct) {
        if (payload.bestBefore !== null) {
            let quantity = (parseInt(this.stocks[payload.stockId].bestBefore[payload.bestBefore]) + payload.quantity);
            this.stocks[payload.stockId].bestBefore[payload.bestBefore] = String(quantity);

        }
        this.stocks[payload.stockId].quantity = this.stocks[payload.stockId].quantity + payload.quantity;
    }

    @Action({commit: 'SET_STOCK_LOCK'})
    lockStocks(): boolean {
        return true;
    }

    @Action({commit: 'SET_STOCK_LOCK'})
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

    get stockById(): (id: string) => ProductStockjsonld {
        return (id: string): ProductStockjsonld => {
            return this.stocks[id];
        }
    }
}

