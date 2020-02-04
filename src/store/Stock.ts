import {Module, VuexModule, Mutation, Action, MutationAction} from 'vuex-module-decorators'
import {
    ProductApi, Productjsonld,
    ProductStockApi, ProductStockjsonld,
    ProductLocationApi, ProductLocationjsonld,
    ProductCategoryApi, ProductCategoryjsonld,
    ProductCollectionApi, ProductCollectionjsonld
} from "@household/api-client";
import { Helpers } from '@/lib/api';

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

    @MutationAction({mutate:['lock']})
    async lockStocks() {
        return {
            lock: true,
        }
    }

    get stockById(): (id: string) => ProductStockjsonld {
        return (id: string): ProductStockjsonld => {
            return this.stocks[id];
        }
    }
}

