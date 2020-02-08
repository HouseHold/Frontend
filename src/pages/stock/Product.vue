<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <template v-if="this.$store.getters.stockNeedsRefresh === false">
              <h2>{{ product.name }}</h2>
            </template>
          </CCardHeader>
          <CCardBody>
            <template v-if="this.$store.getters.stockNeedsRefresh">
              <c-spinner />
            </template>
            <template v-else>
              <stocks-overview :product="product" />
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
    import { Productjsonld } from "@household/api-client";

    @Component({
      components: { StocksOverview }
    })
    export default class StockProduct extends Vue {
        readonly name: string = 'StockProduct';

        //@ts-ignore Will be set in `created()`.
        product: Productjsonld;

        created() {
            this.product = this.$store.getters.productByShortId(this.$route.params.id);
        }

    }
</script>
