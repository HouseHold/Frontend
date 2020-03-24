<template>
    <div>
        <CRow>
            <CCol sm="12">
                <template v-if="this.$store.getters.stockNeedsRefresh">
                    <c-spinner />
                </template>
                <template v-else>
                    <CDataTable
                        :items="items"
                        :fields="fields"
                        column-filter
                        hover
                        sorter
                        pagination
                        :table-filter="{ label: $t('global.form.filter'), placeholder: $t('global.form.type-string') }"
                        :items-per-page-select="{ label: $t('global.form.items-per-page') }"
                    >
                        <template #consume="{item}">
                            <td class="py-2">
                                <CButton color="danger" variant="outline" square size="sm" @click="prepareConsumeProduct(item)">
                                    {{ $t('stock.form.button.consume') }}
                                </CButton>
                            </td>
                        </template>
                        <template #name="{item}">
                            <td>
                                <a class="clickable" @click="onClickProductName(item)">{{ item.name }}</a>
                            </td>
                        </template>
                    </CDataTable>
                    <template v-if="consumeModalProduct !== null">
                        <h-stock-modal-consume
                            :product="consumeModalProduct"
                            color="dark"
                            :show-modal="consumeModal"
                            :title="$t('stock.label.product-consume')"
                            @close="onCloseConsumeModal()"
                        />
                    </template>
                </template>
            </CCol>
        </CRow>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { Api } from '@/lib';
    import { Productjsonld, ProductStockjsonld } from "@household/api-client";
    import HStockModalConsume from "@/components/stock/modal/HStockModalConsume.vue";
    import { DataTableItem } from "@/lib/coreui";

    interface ProductInStockRowItem {
        name: string;
        inStock: number;
        bestBefore: string;
        id: string;
    }

    @Component({
        components: { HStockModalConsume }
    })
    export default class HStockTableProducts extends Vue {
        name: string = 'HStockTableProducts';
        consumeModal: boolean = false;
        consumeModalProduct: Productjsonld|null = null;

        get fields(): Array<DataTableItem> {
            return [
                { key: 'consume', _style: 'width:10%', label: this.$t('global.button.actions').toString(), sorter: false, filter: false },
                { key: 'name', _style: 'width:40%', label: this.$t('global.label.name').toString() },
                { key: 'inStock', _style: 'width:10%;', label: this.$t('stock.label.stock-in').toString() },
                { key: 'bestBefore', _style: 'width:20%;', label: this.$t('stock.label.best-before').toString() },
            ];
        }

        get items(): Array<ProductInStockRowItem> {
            let data: Array<ProductInStockRowItem> = [];

            let products: { [key: string]: Productjsonld } = this.$store.state.Stock.products;
            for (let key in products) {
                let stocks: Array<ProductStockjsonld> = [];
                let quantity: number = 0;
                let bestBefore: number = 0;

                products[key].stocks.forEach((item) => {
                    stocks.push(this.$store.getters.stockById(item));
                });

                stocks.forEach((item) => {
                    quantity += item.quantity;
                    let date: number = Date.parse(Object.keys(item.bestBefore)
                        .sort((a:string, b:string): number => {
                            return Number(Date.parse(a) > Date.parse(b));
                        })[0]);

                    if (bestBefore === 0 || bestBefore < date) {
                        bestBefore = date;
                    }
                });

                const bestBeforeDate: string =
                    products[key].expiring
                        ? (bestBefore === 0 && quantity === 0 // Edge Case: If product has no stocks yet.
                            ? this.$t('stock.label.out-of-stock').toString() // True: Message no stocks.
                            : (new Date(bestBefore)).toLocaleDateString()) // False: Return date
                        : this.$t('stock.label.expiring-not').toString(); // Not expiring.

                data.push({
                    name: products[key].name,
                    inStock: quantity,
                    bestBefore: bestBeforeDate,
                    id: products[key]["@id"]
                });
            }

            return data;
        }

        onClickProductName(item: ProductInStockRowItem) {
            this.$router.push('product/' + Api.Helpers.normalizeIri(item.id));
        }

        prepareConsumeProduct(item: ProductInStockRowItem) {
            this.consumeModal = true;
            this.consumeModalProduct = this.$store.state.Stock.products[item.id];
        }

        onCloseConsumeModal(/** cancel: boolean **/) {
            this.consumeModal = false;
            this.consumeModalProduct = null;
        }
    }
</script>

<style>
</style>
