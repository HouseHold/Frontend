<template>
    <div id="stock-product-create-form">
        <CCard>
            <CCardHeader>
                <strong>Create Product</strong>
            </CCardHeader>
            <CCardBody>
                <CForm>
                    <CCardBody>
                        <CInput
                            v-model="product"
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
                    </ccardbody>
                    <CRow>
                        <CCol col="12">
                            <CButton color="success" @click="save()">
                                Create
                            </CButton>
                        </ccol>
                    </crow>
                </CForm>
            </CCardBody>
        </CCard>
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
        product: string = '';
        ean: Array<string> = [];
        collection: string = '';
        expiring: boolean = true;

        save(): void {
            // let payload: x =
            // this.$store.dispatch('stockCreateProduct', payload);
        }

        get collections(): Array<{label: string, value: string}> {
            let data: Array<{label: string, value: string}> = [];
            for (let id in this.$store.state.Stock.collections) {
                data.push({ label: this.$store.state.Stock.collections[id].name, value: id });
            }

            // Short items alphabetically.
            return data.sort((a,b) => a.label.localeCompare(b.label));
        }
    }
</script>

<style scoped>

</style>
