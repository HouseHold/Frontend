<template>
    <div>
        <c-row>
            <CCol sm="8">
                <h-stock-form-product-add-to-stock />
            </CCol>
            <CCol sm="4">
                <CCard>
                    <CCardHeader>
                        <strong>Product Overview</strong>
                    </CCardHeader>
                    <CCardBody>
                        <p>WIP</p>
                    </CCardBody>
                </CCard>
            </CCol>
        </c-row>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import HStockFormProductAddToStock from "@/components/stock/form/product/HStockFormProductAddToStock.vue";

    @Component({ components: { HStockFormProductAddToStock } })
    export default class StockPurchase extends Vue {
      readonly name: string = 'StockPurchase';
    }
</script>
