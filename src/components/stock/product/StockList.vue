<template>
    <div>
        <h4>Stocks</h4>
        <hr class="d-none d-sm-block">
        <CListGroup v-for="(stock, id) in stocks" :key="id">
            <CListGroupItem>
                {{ stock.name }} <span style="color: #8a94a5">({{ stock.quantity }})</span>
            </CListGroupItem>
            <div />
        </CListGroup>
    </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {Productjsonld, ProductLocationjsonld, ProductStockjsonld} from "@household/api-client";

    @Component
    export default class StockList extends Vue {
        readonly name: string = 'StockList';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Object) readonly product: Productjsonld;

        get stocks(): Array<{name: string, quantity: number}> {
            let data: Array<{name: string, quantity: number}> = [];
            this.product.stocks.forEach((stockId: string) => {
                let stock: ProductStockjsonld = this.$store.state.Stock.stocks[stockId];
                let location: ProductLocationjsonld = this.$store.state.Stock.locations[stock.location];
                data.push({
                    name: location.name,
                    quantity: stock.quantity,
                });
            });

            return data;
        }
    }
</script>

<style scoped>

</style>
