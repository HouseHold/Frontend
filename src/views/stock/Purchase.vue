<template>
    <div>
        <c-row>
            <CCol sm="8">
                <CCard>
                    <CCardHeader>
                        <strong>Add Product to Stock</strong>
                    </CCardHeader>
                    <CCardBody>
                        <Autocomplete
                                :search="searchProducts"
                                label="Product"
                                placeholder="Search product"
                        />
                        <div class="form-group">
                            <label>
                                Best Before
                            </label>
                            <!-- Placeholder issue: https://github.com/nathanreyes/v-calendar/issues/493 -->
                            <date-picker
                                    mode="single"
                                    v-model="selectedDate"
                                    :attributes="pickerAttrs"
                            />
                        </div>
                        <CInput
                                label="Amount"
                                placeholder="Enter amount"
                                type="number"
                        />
                        <CInput
                                label="Price"
                                placeholder="Enter price"
                                type="number"
                                step=".01"
                        />
                        <CSelect
                                label="Location"
                                :options="locations"
                                placeholder="Select Location"
                        />
                        <hr>
                        <CButton block color="success">Submit</CButton>
                        <CButton block color="danger" v-on:click="returnToStock">Cancel</CButton>
                    </CCardBody>
                </CCard>
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

<script>
    import * as HH from 'house_hold/src/index';
    import Autocomplete from '../shared/Autocomplete';
    import gql from 'graphql-tag';

    export default {
        name: 'StockPurchase',
        components: {
            Autocomplete
        },
        data() {
            return {
                locations: [],
                selectedDate: null,
                pickerAttrs: [
                    {
                        key: 'today',
                        highlight: true,
                        dates: new Date(),
                    },
                ],
            }
        },
        mounted() {
            this.getLocations();
        },
        methods: {
            returnToStock: function (event) {
                this.$router.push("overview");
            },
            searchProducts: async function (key) {
                //const productApi = new HH.ProductApi();
                //productApi.getProductCollection()

                const query = {query: gql`
                {
                    products(name: "${key}") {
                        edges {
                            node {
                                name
                            }
                        }
                    }
                }
                `};

                let data = await this.$apollo.query(query);
                data = data['data']['products']['edges'];
                let results = [];
                data.forEach((item ,index) => {
                    results.push(item['node']['name'])
                });

                return results;
            },
            getLocations: function () {
                const locationApi = new HH.ProductLocationApi();
                locationApi.getProductLocationCollection().then((data) => {
                    data = data['hydra:member'];
                    let results = [];
                    data.forEach((item, index) => {
                        results.push(item['name']);
                    });

                    this.locations = results;
                });
            }
        }
    }
</script>
