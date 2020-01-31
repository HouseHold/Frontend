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
                            <c-spinner/>
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
                                        <template #consume="{item, index}">
                                            <td class="py-2">
                                                <CButton
                                                        color="danger"
                                                        variant="outline"
                                                        square
                                                        size="sm"
                                                        @click="consumeProduct(item)"
                                                >Consume
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
                                                <CBadge color="primary" shape="pill">{{ stock.quantity }}</CBadge>
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

<script>
    import {query, denormalizeId} from "../../graphql/products/product";
    import * as HH from "@household/api-client";
    import ApiHelpers from "../../lib/ApiHelpers";

    export default {
        name: 'StockProduct',
        data() {
            return {
                loading: true,
                product: null,
                tableData: null,
                stocks: [],
                fields: [
                    {key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false},
                    {key: 'location', _style: 'width:40%'},
                    {key: 'quantity', _style: 'width:10%;'},
                ],
            }
        },
        created() {
            this.getItem(this.$route.params.id);
        },
        methods: {
            getItem: function (id) {
                this.$apollo
                    .query({query: query, variables: {id: denormalizeId(id)}})
                    .then((data) => {
                        this.product = data['data']['product'];
                        this.tableData = this.getItemsForTable();
                        this.stocks = this.getItemsForStocks();
                        this.loading = false;

                        // Add product best before to the table, if expiring.
                        if (this.product.expiring === true) {
                            this.fields.push({key: 'bestBefore', _style: 'width:20%;'})
                        }
                    });
            },
            getItemsForTable: function () {
                let data = [];
                this.product.stocks.edges.forEach((item, index) => {
                    let dataObj = {
                        id: item['node']['id'],
                        location: item['node']['location']['name'],
                        locationId: item['node']['location']['id'],
                        quantity: item['node']['quantity'],
                    };

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

                return data;
            },
            getItemsForStocks: function () {
                let data = {};
                this.product.stocks.edges.forEach((item, index) => {
                    data[item.node.id] = {
                        id: item.node.id,
                        name: item.node.location.name,
                        quantity: item.node.quantity,
                    }
                });

                return data;
            },
            consumeProduct: function(item) {
                // Do not allow going minus in products.
                if (item.quantity === 0) {
                    return;
                }

                // Remove from stocks. UI Only.
                --item.quantity;
                --this.stocks[item.id].quantity;

                // Remove from stocks. Backend Only.
                (new HH.ProductStockApi()).stockConsumeProductStockItem(
                    ApiHelpers.normalizeIri(item.id),
                    {
                        inlineObject2: HH.InlineObject2.constructFromObject(
                            {
                                quantity: 1,
                                bestBefore: this.product.expiring === true ? item.bestBefore : null,
                            }
                        )
                    }
                );
            },
        }
    }
</script>
