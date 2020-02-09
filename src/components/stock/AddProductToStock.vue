<template>
    <CCard>
        <CCardHeader>
            <strong>Add Product to Stock</strong>
        </CCardHeader>
        <CCardBody>
            <CForm @submit.prevent="addToStock">
                <AutocompleteInput
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
                        v-model="form.bestBefore"
                        mode="single"
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
                <CButton
                    block
                    color="success"
                    type="submit"
                >
                    Submit
                </CButton>
                <CButton
                    block
                    color="danger"
                    @click="returnToStock"
                >
                    Cancel
                </CButton>
            </CForm>
        </CCardBody>
    </CCard>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import ApiClient from "@household/api-client"
    import AutocompleteInput from '@/components/form/AutocompleteInput.vue';
    import gql from 'graphql-tag';
    import {Api} from '@/lib'

    @Component({

        components: {
            AutocompleteInput
        }
    })
    export default class AddProductToStock extends Vue {
        readonly name: string = 'AddProductToStock';

        locations = [];
        locations_id = {};
        products_id = {};
        selectedDate = null;

        form = {
            product: null,
            bestBefore: null,
            amount: null,
            price: null,
            location: null
        };

        pickerAttrs = [
            {
                key: 'today',
                highlight: true,
                dates: new Date(),
            },
        ];

        mounted() {
            this.getLocations();
        }

        isNumber(val: any) {
            return Number(val) > 0;
        }

        addToStock() {
            // const api = new ProductStockApi();
            //@ts-ignore
            let locationId = this.locations_id[this.form.location];
            //@ts-ignore
            let productId = this.products_id[this.form.product];

            // noinspection JSCheckFunctionSignatures
            // api.getProductStockCollection(
            //     {
            //         location: Api.Helpers.normalizeIri(locationId),
            //         product: Api.Helpers.normalizeIri(productId),
            //     }
            // ).then(async (data: any) => {
            //     let stockId;
            //     if (data['hydra:member'].length <= 0) {
            //         stockId = (await this._initializeNewStock(locationId, productId));
            //     } else {
            //         stockId = data['hydra:member'][0]['@id'];
            //     }
            //     await (api.stockAddProductStockItem(
            //         Api.Helpers.normalizeIri(stockId),
            //         {
            //             inlineObject1: InlineObject1.constructFromObject({
            //                     quantity: this.form.amount,
            //                     price: this.form.price,
            //                     bestBefore: this.form.bestBefore
            //                 },
            //                 new InlineObject1()
            //             )
            //         }
            //     ));
            // }).catch((err: string) => {
            //     console.log(err);
            // })

        }

        async _initializeNewStock(locationId: string, productId: string) {
            // const api = new ProductStockApi();
            // let obj = InlineObject.constructFromObject(
            //     {
            //         product: productId,
            //         location: locationId
            //     },
            //     new InlineObject()
            // );
            // noinspection JSCheckFunctionSignatures
            // return (await api.stockInitProductStockCollection({
            //     inlineObject: obj
            // }))['@id'];
        }

        getAutocompleteResult(result: any) {
            this.form.product = result;
        }

        returnToStock() {
            this.$router.push("overview");
        }

        async searchProducts(key: any) {
          if (key.length < 1) {
            return [];
          }

          const query = {
            query: gql`
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
            `
          };

          let data = (await this.$apollo.query(query))['data']['products']['edges'];
          let results: any = [];
          data.forEach((item: any) => {
            results.push(item['node']['name']);
            //@ts-ignore
            this.products_id[item['node']['name']] = item['node']['id'];
          });

          return results;
        }

        getLocations() {
            // const locationApi = new ProductLocationApi();
            // locationApi.getProductLocationCollection({page: 1}).then((data: any) => {
            //     data = data['hydra:member'];
            //     let results: any = [];
            //     let results_id = {};
            //     data.forEach((item: any) => {
            //         results.push(item['name']);
            //         @ts-ignore
                    // results_id[item['name']] = item['@id'];
                // });
                //
                // this.locations_id = results_id;
                // this.locations = results;
            // });
        }
    }
</script>
