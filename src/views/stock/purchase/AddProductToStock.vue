<template>
    <CCard>
        <CCardHeader>
            <strong>Add Product to Stock</strong>
        </CCardHeader>
        <CCardBody>
            <CForm @submit.prevent="addToStock">
                <Autocomplete
                        :search="searchProducts"
                        label="Product"
                        placeholder="Search product"
                        @submit="getAutocompleteResult"
                />
                <div class="form-group">
                    <label>
                        Best Before
                    </label>
                    <!-- Placeholder issue: https://github.com/nathanreyes/v-calendar/issues/493 -->
                    <date-picker
                            mode="single"
                            v-model="form.bestBefore"
                            :attributes="pickerAttrs"
                    />
                </div>
                <CInput
                        v-model="form.amount"
                        label="Amount"
                        placeholder="Enter amount"
                        type="number"
                        invalid-feedback="Please provide amount in numbers."
                        :is-valid="isNumber"
                />
                <CInput
                        v-model="form.price"
                        label="Price"
                        placeholder="Enter price"
                        type="number"
                        step=".01"
                        invalid-feedback="Please provide price in numbers."
                        :is-valid="isNumber"
                />
                <CSelect
                        label="Location"
                        :options="locations"
                        placeholder="Select Location"
                        :value.sync="form.location"
                />
                <hr>
                <CButton block color="success" type="submit">Submit</CButton>
                <CButton block color="danger" v-on:click="returnToStock">Cancel</CButton>
            </CForm>
        </CCardBody>
    </CCard>
</template>

<script>
    import * as HH from '@household/api-client';
    import Autocomplete from '../../shared/Autocomplete';
    import gql from 'graphql-tag';
    import ApiHelpers from '../../../lib/ApiHelpers'

    export default {
        name: 'AddProductToStock',
        components: {
            Autocomplete
        },
        data() {
            return {
                locations: [],
                locations_id: {},
                products_id: {},
                selectedDate: null,
                form: {
                    product: null,
                    bestBefore: null,
                    amount: null,
                    price: null,
                    location: null
                },
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
            isNumber: (val) => {
                return Number(val) > 0;
            },
            addToStock: function (event) {
                const api = new HH.ProductStockApi();
                let locationId = this.locations_id[this.form.location];
                let productId = this.products_id[this.form.product];

                // noinspection JSCheckFunctionSignatures
                api.getProductStockCollection(
                    {
                        location: ApiHelpers.normalizeIri(locationId),
                        product: ApiHelpers.normalizeIri(productId),
                    }
                ).then(async (data) => {
                    console.log(data);
                    let stockId = null;
                    if (data['hydra:member'].length <= 0) {
                        stockId = (await this._initializeNewStock(locationId, productId));
                    } else {
                        stockId = data['hydra:member'][0]['@id'];
                    }
                    await (api.stockAddProductStockItem(
                        ApiHelpers.normalizeIri(stockId),
                        {
                            inlineObject1: HH.InlineObject1.constructFromObject({
                                quantity: this.form.amount,
                                price: this.form.price,
                                bestBefore: this.form.bestBefore
                            })
                        }
                    ));
                }).catch((err) => {
                    console.log(err);
                })

            },
            _initializeNewStock: async function (locationId, productId) {
                const api = new HH.ProductStockApi();
                let obj = HH.InlineObject.constructFromObject(
                    {
                        product: productId,
                        location: locationId
                    }
                );
                // noinspection JSCheckFunctionSignatures
                return (await api.stockInitProductStockCollection({
                    inlineObject:  obj
                }))['@id'];
            },
            getAutocompleteResult: function (result) {
                this.form.product = result;
            },
            returnToStock: function (event) {
                this.$router.push("overview");
            },
            searchProducts: async function (key) {
                if(key.length < 1) {
                    return [];
                }

                const query = {query: gql`
                {
                    products(name: "${key}") {
                        edges {
                            node {
                                name,
                                id
                            }
                        }
                    }
                }
                `};

                let data = (await this.$apollo.query(query))['data']['products']['edges'];
                let results = [];
                data.forEach((item ,index) => {
                    results.push(item['node']['name']);
                    this.products_id[item['node']['name']] = item['node']['id'];
                });

                return results;
            },
            getLocations: function () {
                const locationApi = new HH.ProductLocationApi();
                locationApi.getProductLocationCollection().then((data) => {
                    data = data['hydra:member'];
                    let results = [];
                    let results_id = {};
                    data.forEach((item, index) => {
                        results.push(item['name']);
                        results_id[item['name']] = item['@id'];
                    });

                    this.locations_id = results_id;
                    this.locations = results;
                });
            }
        }
    }
</script>
