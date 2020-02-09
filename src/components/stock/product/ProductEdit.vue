<template>
    <div id="stock-product-edit-form">
        <CRow>
            <CCol col="8">
                <CForm>
                    <CCardBody>
                        <CInput
                            description="Please give product a name"
                            label="Product name"
                            placeholder="Enter product name"
                            :value="product.name"
                            required
                        />
                        <CSelect
                            label="Product collection"
                            description="Please select a collection where product belongs"
                            :options="collections"
                            :value="currentCollection"
                        />
                        <dynamic-input-list :data="product.ean" label="Barcodes" />
                        <p style="color: #3c4b64">
                            Product is part of <b>{{ category }}</b> category.
                        </p>
                        <p style="color: #3c4b64">
                            Product is set to
                            <b v-if="product.expiring">expire</b>
                            <b v-else>not expire</b>.
                        </p>
                    </ccardbody>
                </CForm>
            </CCol>
            <CCol col="4">
                <CIcon name="cil-info" />
                <p>
                    <br>
                    You cannot edit some fields like price. Price is generated based on adding products to the stock.
                    It will be showing always latest price which is currently <b>{{ product.price }}</b>.
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
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {Productjsonld} from "@household/api-client";
  import DynamicInputList from "@/components/form/DynamicInputList.vue";

    @Component({
        components: { DynamicInputList }
    })
    export default class ProductEdit extends Vue {
        readonly name: string = 'ProductEdit';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Object) readonly product: Productjsonld;

        get collections(): Array<string> {
            let data: Array<string> = [];
            for (let id in this.$store.state.Stock.collections) {
                data.push(this.$store.state.Stock.collections[id].name);
            }

            // Short items alphabetically.
            return data.sort((a,b) => a.localeCompare(b));
        }

        get currentCollection(): string {
            return this.$store.state.Stock.collections[this.product.collection].name;
        }

        get category(): string {
            return this.$store.state.Stock.categories[this.$store.state.Stock.collections[this.product.collection].category].name;
        }
    }
</script>

<style scoped>

</style>
