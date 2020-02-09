<template>
    <div>
        <c-row>
            <CCol sm="8">
                <AddProductToStock />
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
    import AddProductToStock from "@/components/stock/AddProductToStock.vue";

    @Component({
      components: {
        AddProductToStock
      }
    })
    export default class StockPurchase extends Vue {
      readonly name: string = 'StockPurchase';
    }
</script>
