<template>
  <CDataTable :items="tableData" :fields="fields" hover sorter pagination>
    <template #consume="{item}">
      <td class="py-2">
        <CButton color="danger" variant="outline" square size="sm" @click="console.log(item)">
          Consume
        </CButton>
      </td>
    </template>
  </CDataTable>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {Productjsonld, ProductLocationjsonld, ProductStockjsonld} from "@household/api-client";

    interface StockProductTableData {
        location: string;
        quantity: number;
        bestBefore?: undefined | string;
    }

    @Component
    export default class StockProduct extends Vue {
        readonly name: string = 'LocationTable';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Object) readonly product: Productjsonld;

        readonly fields: Array<Object> = [
            {key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false},
            {key: 'location', _style: 'width:40%'},
            {key: 'quantity', _style: 'width:10%;'},
        ];

        get tableData() {
            let data: Array<StockProductTableData> = [];

            this.product.stocks.forEach((stockId: string) => {
                let stock: ProductStockjsonld = this.$store.state.Stock.stocks[stockId];
                let location: ProductLocationjsonld = this.$store.state.Stock.locations[stock.location];

                if (!this.product.expiring) {
                    data.push({
                        location: location.name,
                        quantity: stock.quantity,
                    });
                } else {
                    for (let bestBeforeDate in stock.bestBefore) {
                        data.push({
                            bestBefore: bestBeforeDate,
                            location: location.name,
                            quantity: Number(stock.bestBefore[bestBeforeDate]),
                        });
                    }
                }
            });

            return data;
        }

    }
</script>

<style scoped>

</style>
