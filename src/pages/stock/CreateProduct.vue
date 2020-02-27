<template>
    <div>
        <c-row>
            <CCol sm="8">
                <h-stock-form-product-create />
            </CCol>
            <CCol sm="4">
                <CCard>
                    <CCardHeader>
                        <strong>Hints for product</strong>
                    </CCardHeader>
                    <CCardBody>
                        <p>Help text will be placed here.</p>
                    </CCardBody>
                </CCard>
            </CCol>
        </c-row>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import HStockFormProductCreate from "@/components/stock/form/product/HStockFormProductCreate.vue";

    @Component({ components: { HStockFormProductCreate } })
    export default class StockCreateProduct extends Vue {
      readonly name: string = 'StockCreateProduct';
    }
</script>
