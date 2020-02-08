<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <template v-if="this.$store.getters.stockNeedsRefresh === false">
              <h2 />
            </template>
          </CCardHeader>
          <CCardBody>
            <template v-if="this.$store.getters.stockNeedsRefresh">
              <c-spinner />
            </template>
            <template v-else>
              <CRow>
                <CCol sm="8">
                  <h4>Storage Overview</h4>
                  <hr class="d-none d-sm-block">
                  <CDataTable
                    :items="tableData"
                    :fields="fields"
                    hover
                    sorter
                    pagination
                  >
                    <template #consume="{item}">
                      <td class="py-2">
                        <CButton
                          color="danger"
                          variant="outline"
                          square
                          size="sm"
                          @click="consumeProduct(item)"
                        >
                          Consume
                        </CButton>
                      </td>
                    </template>
                  </CDataTable>
                </CCol>
                <CCol sm="4">
                  <h4>Stocks</h4>
                  <hr class="d-none d-sm-block">
                  <CListGroup v-for="(stock, id) in stocks" :key="id">
                    <CListGroupItem>
                      {{ stock.name }} <span style="color: #8a94a5">({{ stock.quantity }})</span>
                    </CListGroupItem>
                    <div />
                  </CListGroup>
                </CCol>
              </CRow>
            </template>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {GQL} from "@/lib";
    import {Productjsonld, ProductLocationjsonld, ProductStockjsonld} from "@household/api-client";

    interface StockProductTableData {
        location: string;
        quantity: number;
        bestBefore?: undefined | string;
    }

    @Component
    export default class StockProduct extends Vue {
        readonly name: string = 'StockProduct';

        private fields: Array<Object> = [
            {key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false},
            {key: 'location', _style: 'width:40%'},
            {key: 'quantity', _style: 'width:10%;'},
        ];
        //@ts-ignore Will be set in `created()`.
        product: Productjsonld;

        created() {
            this.product = this.$store.getters.productByShortId(this.$route.params.id);
        }

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
                          bestBefore:  bestBeforeDate,
                          location: location.name,
                          quantity: Number(stock.bestBefore[bestBeforeDate]),
                        });
                    }
                }
            });

          return data;
        }

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
