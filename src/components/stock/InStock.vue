<template>
  <div>
    <CRow>
      <CCol sm="12">
        <template v-if="loading">
          <c-spinner />
        </template>
        <template v-else>
          <CDataTable
            :items="items"
            :fields="fields"
            column-filter
            table-filter
            items-per-page-select
            hover
            sorter
            pagination
          >
            <template #consume="{item, index}">
              <td class="py-2">
                <CButton
                  color="danger"
                  variant="outline"
                  square
                  size="sm"
                  @click="consumeProduct(index)"
                >
                  Consume
                </CButton>
              </td>
            </template>
            <template #name="{item, index}">
              <td>
                <a
                  class="clickable"
                  @click="onClickProductName(index)"
                >{{ item.name }}</a>
              </td>
            </template>
            <template #show_details="{item, index}">
              <td class="py-2">
                <CButton
                  color="primary"
                  variant="outline"
                  square
                  size="sm"
                  @click="toggleDetails(index)"
                >
                  {{ details.includes(index) ? 'Hide' : 'Show' }}
                </CButton>
              </td>
            </template>
            <template #details="{item, index}">
              <CCollapse :show="details.includes(index)">
                <CCardBody>
                  {{ index + 1 }} - {{ item }}
                </CCardBody>
              </CCollapse>
            </template>
          </CDataTable>
        </template>
      </CCol>
    </CRow>
  </div>
</template>

<script>
    import { GQL, Api } from '@/lib';
    import * as HH from '@household/api-client';

    const fields = [
        {key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false},
        {key: 'name', _style: 'width:40%'},
        {key: 'inStock', _style: 'width:10%;'},
        {key: 'bestBefore', _style: 'width:20%;'},
    ];
    export default {
        name: 'InStock',
        data() {
            return {
                loading: true,
                items: [],
                fields,
                details: []
            }
        },
        created() {
            this.getInStockItems();
        },
        methods: {
            onClickProductName: function(index) {
                this.$router.push('product/'+Api.Helpers.normalizeIri(this.items[index]['id']));
            },
            toggleDetails(index) {
                const position = this.details.indexOf(index);
                position !== -1 ? this.details.splice(position, 1) : this.details.push(index)
            },
            consumeProduct: function(index) {
                let item = this.items[index];
                const client = new HH.ProductStockApi();
                let _bestBefore = null;
                if (item.expiring === true) {
                    _bestBefore = item.bestBefore;
                }
                --this.items[index].stocks[0].quantity;
                --this.items[index].inStock;
                client.stockConsumeProductStockItem(
                    Api.Helpers.normalizeIri(item.stocks[0].id),
                    {
                        inlineObject2: HH.InlineObject2.constructFromObject(
                            {
                                quantity: 1,
                                bestBefore: _bestBefore,
                            }
                        )
                    }
                );
            },
            _processStockEdges: function (data) {
                data.forEach((item, index) => {
                    item = item['node'];
                    let totalStock = 0;
                    let bestBefore = null;
                    let bestBeforeAll = {};
                    let stocks = [];
                    item['stocks']['edges'].forEach((stockItem, index) => {
                        stockItem = stockItem['node'];
                        stocks.push(
                            {
                                id: stockItem['id'],
                                quantity: stockItem['quantity'],
                                location: stockItem['location'],
                            });
                        totalStock += stockItem['quantity'];
                        if (item['expiring'] === true) {
                            Object.keys(stockItem['bestBefore']).forEach((bestBeforeDate) => {
                                if (bestBeforeDate in bestBeforeAll) {
                                    bestBeforeAll[bestBeforeDate] += stockItem['bestBefore'][bestBeforeDate];
                                } else {
                                    bestBeforeAll[bestBeforeDate] = stockItem['bestBefore'][bestBeforeDate];
                                }
                            });
                            let dates = Object.keys(stockItem['bestBefore']);
                            dates.sort((a, b) => {
                                return Date.parse(a) > Date.parse(b);
                            });
                            if (bestBefore === null) {
                                bestBefore = Date.parse(dates[0]);
                            } else {
                                let parsedDate = Date.parse(dates[0]);
                                if (bestBefore > parsedDate) {
                                    bestBefore = parsedDate;
                                }
                            }
                        }
                    });

                    let result = {
                        id: item['id'],
                        name: item['name'],
                        ean: item['ean'],
                        price: item['price'],
                        expiring: item['expiring'],
                        inStock: totalStock,
                        stocks: stocks,
                        collection: {name: item['collection']['name'], id: item['collection']['id']},
                        category: {
                            name: item['collection']['category']['name'],
                            id: item['collection']['category']['id']
                        },
                        bestBefore: bestBefore === null ? 'Not expiring' : (new Date(bestBefore)).toLocaleDateString(),
                        bestBeforeAll: bestBeforeAll

                    };
                    this.items.push(result);
                    if (this.loading === true) {
                        this.loading = false;
                    }
                });
            },
            getInStockItems: async function () {
                let data = await this.$apollo.query({query: GQL.Product.Stock, variables: {cursor: 'LTE='}});
                this._processStockEdges(data['data']['products']['edges']);
                if (data['data']['products']['pageInfo']['hasNextPage']) {
                    let hasNextPage = true;
                    let endCursor = data['data']['products']['pageInfo']['endCursor'];
                    while (hasNextPage) {
                        let data = await this.$apollo.query({query: GQL.Product.Stock, variables: {cursor: endCursor}});
                        this._processStockEdges(data['data']['products']['edges']);
                        hasNextPage = data['data']['products']['pageInfo']['hasNextPage'];
                        endCursor = data['data']['products']['pageInfo']['endCursor'];
                    }
                }
            }
        }
    }
</script>

<style>
    .clickable {
        cursor: pointer;
    }
</style>
