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
                                        Stock
                                    </CLink>
                                </li>
                                <li class="nav-item">
                                    <CLink class="nav-link" :active="currentTab === 'edit'" @click="currentTab = 'edit'">
                                        Edit
                                    </CLink>
                                </li>
                            </CNav>
                            <div>
                                <stocks-overview v-if="currentTab === 'stock'" :product="product" />
                                <product-edit v-if="currentTab === 'edit'" :product-id="product['@id']" />
                            </div>
                        </template>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import StocksOverview from "@/components/stock/product/StocksOverview.vue";
    import ProductEdit from "@/components/stock/product/ProductEdit.vue";
    import { Productjsonld } from "@household/api-client";

    @Component({
      components: { StocksOverview, ProductEdit }
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
