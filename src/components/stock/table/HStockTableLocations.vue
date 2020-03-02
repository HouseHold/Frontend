<template>
    <div>
        <CDataTable :items="tableData" :fields="fields" hover sorter pagination>
            <template #consume="{item}">
                <td class="py-2">
                    <CButton color="danger" variant="outline" square size="sm" @click="onConsume(item)">
                        {{ $t('stock.form.button.consume') }}
                    </CButton>
                </td>
            </template>
        </CDataTable>
        <div v-if="consumeModal">
            <h-stock-modal-consume
                :product="product"
                :stock="selected.stock"
                :best-before="selected.bestBefore"
                color="dark"
                :show-modal="consumeModal"
                :title="$t('stock.label.product-consume')"
                @close="onCloseConsumeModal()"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import { Productjsonld, ProductLocationjsonld, ProductStockjsonld } from "@household/api-client";
    import { DataTableItem } from "@/lib/coreui";
    import HStockModalConsume from "@/components/stock/modal/HStockModalConsume.vue";

    interface StockProductTableData {
        location: string;
        quantity: number;
        bestBefore?: undefined | string;
        stock: ProductStockjsonld;
    }

    @Component({
        components: { HStockModalConsume }
    })
    export default class HStockTableLocations extends Vue {
        readonly name: string = 'HStockTableLocations';
        consumeModal: boolean = false;
        selected?: {stock: ProductStockjsonld, bestBefore: { date: string, amount: number }|null };
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Object) readonly product: Productjsonld;

        onCloseConsumeModal(/** cancel: boolean **/) {
            this.consumeModal = false;
        }

        onConsume(item: StockProductTableData) {
            this.selected = {
                stock: item.stock,
                bestBefore: item.bestBefore !== undefined ? { amount: item.quantity, date: item.bestBefore } : null,
            };
            this.consumeModal = true;
        }

        get tableData() {
            let data: Array<StockProductTableData> = [];

            this.product.stocks.forEach((stockId: string) => {
                let stock: ProductStockjsonld = this.$store.state.Stock.stocks[stockId];
                let location: ProductLocationjsonld = this.$store.state.Stock.locations[stock.location];

                if (!this.product.expiring) {
                    data.push({
                        stock: stock,
                        location: location.name,
                        quantity: stock.quantity,
                    });
                } else {
                    for (let bestBeforeDate in stock.bestBefore) {
                        data.push({
                            stock: stock,
                            bestBefore: bestBeforeDate,
                            location: location.name,
                            quantity: Number(stock.bestBefore[bestBeforeDate]),
                        });
                    }
                }
            });

            return data;
        }

        get fields(): Array<DataTableItem> {
            if (this.product.expiring) {
                return [
                    { key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false },
                    { key: 'location', _style: 'width:30%' },
                    { key: 'quantity', _style: 'width:10%;' },
                    { key: 'bestBefore', _style: 'width:15%;' },
                ];
            }

            return [
                { key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false },
                { key: 'location', _style: 'width:40%' },
                { key: 'quantity', _style: 'width:10%;' },
            ];
        }

    }
</script>

<style scoped>

</style>
