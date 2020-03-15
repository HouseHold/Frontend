<template>
    <div id="stock-product-edit-form">
        <CRow>
            <CCol col="8">
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
                            :value.sync="manufacturer"
                            :label="$t('stock.label.product-manufacturer')"
                            :description="$t('stock.form.desc.please-give-product-manufacturer')"
                            :options="manufacturers"
                        />
                        <CSelect
                            :value.sync="collection"
                            :label="$t('stock.label.product-collection')"
                            :description="$t('stock.form.desc.please-give-product-collection')"
                            :options="collections"
                        />
                        <dynamic-input-list ref="dynInput" :data="ean" :label="$t('stock.label.barcodes')" field="number"
                                            :empty="$t('stock.form.hint.no-barcodes')" @update:data="ean = $event"
                        />
                        <p style="color: #3c4b64" v-html="$t('stock.text.product-part-of-category', { 'category': htmlCategory })" />
                        <p style="color: #3c4b64" v-html="htmlExpiring" />
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
            </CCol>
            <CCol col="4">
                <CIcon name="cil-info" />
                <p>
                    <br>
                    {{ $t('stock.text.product-edit-hint-line-1') }}
                    {{ $t('stock.text.product-edit-hint-line-2') }} <b>{{ this.$store.state.Stock.products[productId].price }}</b>.
                    <br> <br>
                    {{ $t('stock.text.product-edit-hint-line-3') }}
                    {{ $t('stock.text.product-edit-hint-line-4') }}
                    <br> <br>
                    {{ $t('stock.text.product-edit-hint-line-5') }}
                    {{ $t('stock.text.product-edit-hint-line-6') }}
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
    export default class HStockFormProductEdit extends Vue {
        readonly name: string = 'HStockFormProductEdit';
        ean: Array<string> = [];
        productName: string = '';
        collection: string = '';
        manufacturer: string = '';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(String) readonly productId: string;

        created(): void {
            this.resetFields();
        }

        resetFields(): void {
            this.ean = _.clone(this.$store.state.Stock.products[this.productId].ean);
            this.productName = _.clone(this.$store.state.Stock.products[this.productId].name);
            this.collection = _.clone(this.$store.state.Stock.products[this.productId].collection);
            this.manufacturer = _.clone(this.$store.state.Stock.products[this.productId].manufacturer);
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
            payload.manufacturer = this.manufacturer;
            this.$store.dispatch('stockUpdateProduct', payload);
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

        get manufacturers(): Array<{label: string, value: string, disabled: boolean}> {
            let data: Array<{label: string, value: string, disabled: boolean}> = [];
            for (let id in this.$store.state.Stock.manufacturers) {
                data.push({ label: this.$store.state.Stock.manufacturers[id].name, value: id, disabled: false });
            }

            const hint = '=== ' + this.$t('global.form.select-one').toString() + ' ===';
            data = data.sort((a,b) => a.label.localeCompare(b.label)); // Short items alphabetically.
            data.unshift({ label: hint, value: 'placeholder', disabled: true }); // Need to add this due ios.

            return data;
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

        get htmlCategory(): string {
            return `<b>${this.category}</b>`;
        }

        get htmlExpiring(): string {
            if (this.$store.state.Stock.products[this.productId].expiring) {
                return this.$t('stock.text.product-is-expiring', ['<b>', '</b>']).toString();
            }

            return this.$t('stock.text.product-is-not-expiring', ['<b>', '</b>']).toString();
        }
    }
</script>

<style scoped>

</style>
