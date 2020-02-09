<template>
    <CRow>
        <CCol sm="8">
            <h4>Storage Overview</h4>
            <hr class="d-none d-sm-block">
            <location-table :product="product" />
        </CCol>
        <CCol sm="4">
            <stock-list :product="product" />
        </CCol>
    </CRow>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {Productjsonld} from "@household/api-client";
    import LocationTable from "@/components/stock/product/LocationTable.vue";
    import StockList from "@/components/stock/product/StockList.vue";

    @Component({
      components: { StockList, LocationTable }
    })
    export default class StockProduct extends Vue {
        readonly name: string = 'StocksOverview';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Object) readonly product: Productjsonld;
    }
</script>

<style scoped>

</style>
