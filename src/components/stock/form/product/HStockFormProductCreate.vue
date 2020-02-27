<template>
    <div id="stock-product-create-form">
        <CRow>
            <CCol col="8">
                <CForm>
                    <CCardBody>
                        <CInput
                            v-model="productName"
                            description="Please give product a name"
                            label="Product name"
                            placeholder="Enter product name"
                            required
                        />
                        <CSelect
                            v-model="collection"
                            label="Product collection"
                            description="Please select a collection where product belongs"
                            :options="collections"
                            @update:value="collection = $event"
                        />
                        <dynamic-input-list ref="dynInput" :data="ean" label="Barcodes" field="number" @update:data="ean = $event" />
                        <p style="color: #3c4b64">
                            Product is part of
                            <b>
                                {{ category }}
                            </b> category.
                        </p>
                        <p style="color: #3c4b64">
                            Product is set to
                            <b v-if="this.$store.state.Stock.products[productId].expiring">expire</b>
                            <b v-else>not expire</b>.
                        </p>
                    </ccardbody>
                    <CRow>
                        <CCol col="12">
                            <div class="float-right">
                                <CButton color="warning" style="margin-right: 10px" @click="reset()">
                                    Reset
                                </CButton>
                                <CButton color="success" @click="save()">
                                    Save
                                </CButton>
                            </div>
                        </CCol>
                    </CRow>
                </CForm>
            </CCol>
            <CCol col="4">
                <CIcon name="cil-info" />
                <p>
                    <br>
                    You cannot edit some fields like price. Price is generated based on adding products to the stock.
                    It will be showing always latest price which is currently <b>{{ this.$store.state.Stock.products[productId].price }}</b>.
                    <br> <br>
                    Also you cannot change the category of product here. To move this product into different category,
                    you need to change product collection, which is under different category.
                    <br> <br>
                    You cannot change product from expiring to non-expiring or opposite.
                    If you like to do that, you need to re-create product.
                </p>
            </CCol>
        </CRow>
    </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { Productjsonld } from "@household/api-client";
  import DynamicInputList from "@/components/form/DynamicInputList.vue";
  import _ from "lodash";

    @Component({
        components: { DynamicInputList }
    })
    export default class HStockFormProductCreate extends Vue {
        readonly name: string = 'HStockFormProductCreate';
        ean: Array<string> = [];
        productName: string = '';
        collection: string = '';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(String) readonly productId: string;

        created(): void {
            this.resetFields();
        }

        resetFields(): void {
            this.ean = _.clone(this.$store.state.Stock.products[this.productId].ean);
            this.productName = _.clone(this.$store.state.Stock.products[this.productId].name);
            this.collection = _.clone(this.$store.state.Stock.products[this.productId].collection);
        }

        reset(): void {
            this.resetFields();
            //@ts-ignore
            this.$refs.dynInput.setData(this.ean);
        }

        save(): void {
            let payload: Productjsonld = _.clone(this.$store.state.Stock.products[this.productId]);
            payload.ean = this.ean;
            payload.name = this.productName;
            payload.collection = this.collection;
            this.$store.dispatch('stockUpdateProduct', payload);
        }

        get collections(): Array<{label: string, value: string}> {
            let data: Array<{label: string, value: string}> = [];
            for (let id in this.$store.state.Stock.collections) {
                data.push({ label: this.$store.state.Stock.collections[id].name, value: id });
            }

            // Short items alphabetically.
            return data.sort((a,b) => a.label.localeCompare(b.label));
        }

        get category(): string {
            return this.$store.state.Stock.categories
                [this.$store.state.Stock.collections
                [this.$store.state.Stock.products
                [this.productId
                ].collection
                ].category
                ].name
        }
    }
</script>

<style scoped>

</style>
