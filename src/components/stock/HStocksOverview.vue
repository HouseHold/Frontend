<template>
    <CRow>
        <CCol sm="8">
            <h4>{{ $t('stock.title.storage-overview') }}</h4>
            <hr class="d-none d-sm-block">
            <h-stock-table-locations :product="product" />
        </CCol>
        <CCol sm="4">
            <h-stock-table-stocks :product="product" />
        </CCol>
    </CRow>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import { Productjsonld } from "@household/api-client";
    import HStockTableStocks from "@/components/stock/table/HStockTableStocks.vue";
    import HStockTableLocations from "@/components/stock/table/HStockTableLocations.vue";

    @Component({
      components: { HStockTableStocks, HStockTableLocations }
    })
    export default class HStocksOverview extends Vue {
        readonly name: string = 'HStocksOverview';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Object) readonly product: Productjsonld;
    }
</script>

<style scoped>

</style>
