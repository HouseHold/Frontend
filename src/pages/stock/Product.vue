<template>
    <div>
        <CRow>
            <CCol sm="12">
                <CCard>
                    <CCardHeader>
                        <template v-if="this.$store.getters.stockNeedsRefresh === false">
                            <h2>{{ this.$store.state.Stock.products[product['@id']].name }}</h2>
                        </template>
                    </CCardHeader>
                    <CCardBody>
                        <template v-if="this.$store.getters.stockNeedsRefresh">
                            <c-spinner />
                        </template>
                        <template v-else>
                            <CNav justified variant="tabs" style="margin-bottom: 25px">
                                <li class="nav-item">
                                    <CLink class="nav-link" :active="currentTab === 'stock'" @click="currentTab = 'stock'">
                                        {{ $t('stock.title.stock') }}
                                    </CLink>
                                </li>
                                <li class="nav-item">
                                    <CLink class="nav-link" :active="currentTab === 'edit'" @click="currentTab = 'edit'">
                                        {{ $t('global.button.edit') }}
                                    </CLink>
                                </li>
                            </CNav>
                            <div>
                                <h-stocks-overview v-if="currentTab === 'stock'" :product="product" />
                                <h-stock-form-product-edit v-if="currentTab === 'edit'" :product-id="product['@id']" />
                            </div>
                        </template>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import HStocksOverview from "@/components/stock/HStocksOverview.vue";
    import HStockFormProductEdit from "@/components/stock/form/product/HStockFormProductEdit.vue";
    import { Productjsonld } from "@household/api-client";

    @Component({
      components: { HStocksOverview, HStockFormProductEdit }
    })
    export default class StockProduct extends Vue {
        readonly name: string = 'StockProduct';

        //@ts-ignore Will be set in `created()`.
        product: Productjsonld;
        currentTab: string = 'stock';
        test: boolean = false;

        created() {
            this.product = this.$store.getters.productByShortId(this.$route.params.id);
        }
    }
</script>
