<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <template v-if="loading === false">
              <h2>{{ this.product.name }}</h2>
            </template>
          </CCardHeader>
          <CCardBody>
            <template v-if="loading">
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
                  <CListGroup>
                    <div v-for="stock in stocks">
                      <CListGroupItem>
                        {{ stock.name }}
                        <CBadge
                          color="primary"
                          shape="pill"
                        >
                          {{ stock.quantity }}
                        </CBadge>
                      </CListGroupItem>
                    </div>
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
    import {GQL, Api} from "@/lib";
    import Store from '@/store';

    @Component
    export default class StockProduct extends Vue {
        readonly name: string = 'StockProduct';
        loading: boolean = true;
        product: Object = {};
        tableData: Object = [];
        stocks: Object = [];

        fields = [
            {key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false},
            {key: 'location', _style: 'width:40%'},
            {key: 'quantity', _style: 'width:10%;'},
        ];

        created() {
            this.getItem(this.$route.params.id);
        }

        getItem(id: string) {
            this.$apollo
                .query({query: GQL.Product.Product.query, variables: {id: GQL.Product.Product.denormalizeId(id)}})
                .then((data) => {
                    this.product = data['data']['product'];
                    this.tableData = this.getItemsForTable();
                    this.stocks = this.getItemsForStocks();
                    this.loading = false;

                    // Add product best before to the table, if expiring.
                    //@ts-ignore
                    if (this.product.expiring === true) {
                        this.fields.push({key: 'bestBefore', _style: 'width:20%;'})
                    }
                });
        }

        getItemsForTable() {
            //@ts-ignore
            let data = [];
            //@ts-ignore
            this.product.stocks.edges.forEach((item) => {
                let dataObj = {
                    id: item['node']['id'],
                    location: item['node']['location']['name'],
                    locationId: item['node']['location']['id'],
                    quantity: item['node']['quantity'],
                };

                //@ts-ignore
                if (this.product.expiring === true) {
                    Object.keys(item['node']['bestBefore']).forEach((bestBeforeDate) => {
                        data.push({
                            id: dataObj.id,
                            location: dataObj.location,
                            locationId: dataObj.locationId,
                            quantity: item['node']['bestBefore'][bestBeforeDate],
                            bestBefore: new Date(bestBeforeDate).toLocaleDateString(),
                        });
                    });
                } else {
                    data.push(dataObj);
                }
            });

            //@ts-ignore
            return data;
        }

        getItemsForStocks() {
            let data = {};
            //@ts-ignore
            this.product.stocks.edges.forEach((item) => {
                //@ts-ignore
                data[item.node.id] = {
                    id: item.node.id,
                    name: item.node.location.name,
                    quantity: item.node.quantity,
                }
            });

            return data;
        }

        consumeProduct(item: any) {
            // Do not allow going minus in products.
            if (item.quantity === 0) {
                return;
            }

            // Remove from stocks. UI Only.
            --item.quantity;
            //@ts-ignore
            --this.stocks[item.id].quantity;

            // TODO:
            // Remove from stocks. Backend Only.
            //(new ProductStockApi()).stockConsumeProductStockItem(
            //    Api.Helpers.normalizeIri(item.id),
            //    {
            //         inlineObject2: InlineObject2.constructFromObject(
            //             {
            //                 quantity: 1,
            //                 @ts-ignore
                            // bestBefore: this.product.expiring === true ? item.bestBefore : null,
                        // },
                        // new InlineObject2()
                    // )
                // }
            // );
        }
    }
</script>
