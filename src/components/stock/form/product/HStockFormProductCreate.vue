<template>
    <div id="stock-product-create-form">
        <CCard>
            <CCardHeader>
                <strong>{{ $t('stock.title.product-create') }}</strong>
            </CCardHeader>
            <CCardBody>
                <CForm>
                    <CCardBody>
                        <CInput
                            v-model="product"
                            :description="$t('stock.form.desc.please-give-product-name')"
                            :label="$t('stock.label.product-name')"
                            :placeholder="$t('stock.form.hint.enter-product-name')"
                            required
                        />
                        <CSelect
                            :label="$t('stock.label.product-collection')"
                            :description="$t('stock.form.desc.please-give-product-collection')"
                            :options="collections"
                            @update:value="collection = $event.toString()"
                            value="placeholder"
                        />
                        <dynamic-input-list ref="dynInput" :data="ean" :label="$t('stock.label.barcodes')"
                                            field="number" @update:data="ean = $event" placeholder="12344567"
                                            :valid="isBarcodeValid()" :empty="$t('stock.form.hint.no-barcodes')"
                                            :invalid-feedback="$t('stock.form.error.barcode-empty')" />

                        <CInputCheckbox :label="$t('stock.form.hint.product-expiring')" custom
                                        :checked="expiring" @click="expiring = !expiring"/>
                    </CCardBody>
                    <CRow>
                        <CCol col="12">
                            <div class="float-right">
                                <CButton color="success" style="margin-right: 10px" @click="save()">
                                    {{ $t('global.button.submit') }}
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
  import { Component, Vue } from "vue-property-decorator";
  import DynamicInputList from "@/components/form/DynamicInputList.vue";

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
            console.log(this.product);
            console.log(this.ean);
            console.log(this.collection);
            console.log(this.expiring);
            // let payload: x =
            // this.$store.dispatch('stockCreateProduct', payload);
        }

        isBarcodeValid(): boolean {
            let valid: boolean = true;
            this.ean.forEach((item: string) => {
                if (item === '') {
                    valid = false;
                }
            });

            return valid;
        }

        get collections(): Array<{label: string, value: string, disabled: boolean}> {
            let data: Array<{label: string, value: string, disabled: boolean}> = [];
            for (let id in this.$store.state.Stock.collections) {
                data.push({ label: this.$store.state.Stock.collections[id].name, value: id, disabled: false });
            }

            const hint = '=== ' + this.$t('global.form.select-one').toString() + ' ===';
            data = data.sort((a,b) => a.label.localeCompare(b.label)); // Short items alphabetically.
            data.unshift({ label: hint, value: 'placeholder', disabled: true }); // Need to add this due ios.
            return data;
        }
    }
</script>

<style scoped>

</style>
