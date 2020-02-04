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
    import {GQL, Api} from '@/lib';
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
                loading: false,
                fields,
                details: []
            }
        },
        computed: {
            items: function () {
                // {name,inStock,BestBefore,@id}
                let data = [];

                let products = this.$store.state.Stock.products;
                console.log(products);
                for (let key in products) {
                    let stocks = [];
                    let quantity = 0;
                    products[key].stocks.forEach((item) => {
                        stocks.push(this.$store.getters.stockById(item));
                    });

                    stocks.forEach((item) => {
                        quantity += item.quantity;
                    });

                    data.push({
                        name: products[key].name,
                        inStock: quantity,
                        bestBefore: 'Pew',
                        id: products[key]['@id']
                    });
                }

                //products.forEach((item, key) => {
                //    productStocks.push(this.$store.state.Stock.stocks[key]);
                //});

                //console.log(productStocks);


                return data;
            }
        },
        methods: {
            onClickProductName: function (index) {
                this.$router.push('product/' + Api.Helpers.normalizeIri(this.items[index]['id']));
            },
            consumeProduct: function (index) {
                let item = this.items[index];
                const client = new HH.ProductStockApi();
                let _bestBefore = null;
                if (item.expiring === true) {
                    _bestBefore = item.bestBefore;
                }
                --this.items[index].stocks[0].quantity;
                --this.items[index].inStock;
                // client.stockConsumeProductStockItem(
                //     Api.Helpers.normalizeIri(item.stocks[0].id),
                //     {
                //         inlineObject2: HH.InlineObject2.constructFromObject(
                //             {
                //                 quantity: 1,
                //                 bestBefore: _bestBefore,
                //             }
                //         )
                //     }
                // );
            },
        }
    }
</script>

<style>
    .clickable {
        cursor: pointer;
    }
</style>
