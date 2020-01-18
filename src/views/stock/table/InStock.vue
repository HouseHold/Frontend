<template>
    <div>
        <CRow>
            <CCol sm="12">
                <template v-if="loading">
                    <c-spinner/>
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
                        <template #status="{item}">
                            <td>
                                <CBadge :color="getBadge(item.status)">
                                    {{item.status}}
                                </CBadge>
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
                                    {{details.includes(index) ? 'Hide' : 'Show'}}
                                </CButton>
                            </td>
                        </template>
                        <template #details="{item, index}">
                            <CCollapse :show="details.includes(index)">
                                <CCardBody>
                                    {{index + 1}} - {{item}}
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
    import * as HH from '@household/api-client';
    import gql from 'graphql-tag';

    const fields = [
        {key: 'name', _style: 'width:40%'},
        {key: 'inStock', _style: 'width:20%;'},
        {key: 'bestBefore', _style: 'width:20%;'},
        {
            key: 'show_details',
            label: '',
            _style: 'width:1%',
            sorter: false,
            filter: false
        }
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
            getBadge(status) {
                return status === 'Active' ? 'success'
                    : status === 'Inactive' ? 'secondary'
                        : status === 'Pending' ? 'warning'
                            : status === 'Banned' ? 'danger' : 'primary'
            },
            toggleDetails(index) {
                const position = this.details.indexOf(index);
                position !== -1 ? this.details.splice(position, 1) : this.details.push(index)
            },
            getInStockItems: async function() {
                const query = {
                    query: gql`
                        query listAll {
                            products(name: "")
                            {
                                edges
                                {
                                    node
                                    {
                                        id,
                                        collection
                                        {
                                            id,
                                            name,
                                            category {
                                                id,
                                                name,
                                            }
                                        }
                                        name,
                                        ean,
                                        price,
                                        expiring,
                                        stocks
                                        {
                                            edges
                                            {
                                                node
                                                {
                                                    id,
                                                    quantity,
                                                    bestBefore
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                `};
                let data = (await this.$apollo.query(query))['data']['products']['edges'];
                let results = [];
                data.forEach((item, index) => {
                    item = item['node'];
                    let totalStock = 0;
                    let bestBefore = null;
                    let bestBeforeAll = {};
                    let stocks = [];
                    item['stocks']['edges'].forEach((stockItem, index) => {
                        stockItem = stockItem['node'];
                        stocks.push(stockItem['id']);
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
                        location: item['location'],
                        inStock: totalStock,
                        stocks: stocks,
                        collection: {name: item['collection']['name'], id: item['collection']['id']},
                        category: {name: item['collection']['category']['name'], id: item['collection']['category']['id']},
                        bestBefore: bestBefore === null ? 'Not expiring.' : (new Date(bestBefore)).toLocaleDateString(),
                        bestBeforeAll: bestBeforeAll

                    };
                    results.push(result);
                });

                this.items = results;
                this.loading = false;
            }
        }
    }
</script>
