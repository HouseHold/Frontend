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
                            v-model="productName"
                            :description="$t('stock.form.desc.please-give-product-name')"
                            :label="$t('stock.label.product-name')"
                            :placeholder="$t('stock.form.hint.enter-product-name')"
                            required
                        />
                        <CSelect
                            v-model="collection"
                            :label="$t('stock.label.product-collection')"
                            :description="$t('stock.form.desc.please-give-product-collection')"
                            :options="collections"
                            @update:value="collection = $event"
                        />
                        <dynamic-input-list ref="dynInput" :data="ean" :label="$t('stock.label.barcodes')" field="number" @update:data="ean = $event" />
                    </ccardbody>
                    <CRow>
                        <CCol col="12">
                            <div class="float-right">
                                <CButton color="warning" style="margin-right: 10px" @click="reset()">
                                    {{ $t('global.button.reset') }}
                                </CButton>
                                <CButton color="success" @click="save()">
                                    {{ $t('global.button.save') }}
                                </CButton>
                            </div>
                        </CCol>
                    </CRow>
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
