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
                        table-filter
                        items-per-page-select
                        hover
                        sorter
                        pagination
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
        fields: Array<DataTableItem> = [
            { key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false },
            { key: 'name', _style: 'width:40%' },
            { key: 'inStock', _style: 'width:10%;' },
            { key: 'bestBefore', _style: 'width:20%;' },
        ];

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

                data.push({
                    name: products[key].name,
                    inStock: quantity,
                    bestBefore: products[key].expiring ? (new Date(bestBefore)).toLocaleDateString() : 'Not expiring',
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
