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
                                :value.sync="manufacturer"
                                :label="$t('stock.label.product-manufacturer')"
                                :description="$t('stock.form.desc.please-give-product-manufacturer')"
                                :options="manufacturersData"
                                :is-valid="selectValidator"
                        >
                            <template #append>
                                <CButton color="success" @click="createManufacturerModal = !createManufacturerModal">
                                    {{ $t('global.button.new') }}
                                </CButton>
                            </template>
                        </CSelect>
                        <CSelect
                            :value.sync="collection"
                            :label="$t('stock.label.product-collection')"
                            :description="$t('stock.form.desc.please-give-product-collection')"
                            :options="collectionsData"
                            :is-valid="selectValidator"
                        >
                            <template #append>
                                <CButton color="success" @click="createCollectionModal = !createCollectionModal">
                                    {{ $t('global.button.new') }}
                                </CButton>
                            </template>
                        </CSelect>
                        <dynamic-input-list ref="dynInput" :data="ean" :label="$t('stock.label.barcodes')"
                                            field="number" placeholder="12344567" :valid="isBarcodeValid()"
                                            :empty="$t('stock.form.hint.no-barcodes')" :invalid-feedback="$t('stock.form.error.barcode-empty')"
                                            @update:data="ean = $event"
                        />

                        <CInputCheckbox :label="$t('stock.form.hint.product-expiring')" custom
                                        :checked="expiring" @click="expiring = !expiring"
                        />
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
            <h-stock-modal-create-collection
                :show-modal="createCollectionModal"
                @close="createCollectionModal = false"
                @created="onNewCollection"
            />
            <h-stock-modal-create-manufacturer
                :show-modal="createManufacturerModal"
                @close="createManufacturerModal = false"
                @created="onNewManufacturer"
            />
        </CCard>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import DynamicInputList from "@/components/form/DynamicInputList.vue";
  import CreateProduct from "@/store/Stock/CreateProduct";
  import HStockModalCreateCollection from "@/components/stock/modal/HStockModalCreateCollection.vue";
  import HStockModalCreateManufacturer from "@/components/stock/modal/HStockModalCreateManufacturer.vue";
  import {ProductCollectionjsonld, ProductManufacturerjsonld} from "@household/api-client";
  import { errorToast } from "@/lib/Toast";

    @Component({
        components: { DynamicInputList, HStockModalCreateCollection, HStockModalCreateManufacturer }
    })
    export default class HStockFormProductCreate extends Vue {
        readonly name: string = 'HStockFormProductCreate';
        product: string = '';
        ean: Array<string> = [];
        collection: string = 'placeholder';
        manufacturer: string = 'placeholder';
        expiring: boolean = true;
        createCollectionModal: boolean = false;
        createManufacturerModal: boolean = false;
        collectionsData: Array<{label: string, value: string, disabled: boolean}> = [];
        manufacturersData: Array<{label: string, value: string, disabled: boolean}> = [];

        mounted() {
            this.collections();
            this.manufacturers();
        }

        async save(): Promise<void> {
            const payload: CreateProduct = {
                product: this.product,
                collection: this.collection,
                manufacturer: this.manufacturer,
                ean: this.ean,
                expiring: this.expiring,
            };

            if (payload.product === '') {
                this.$toasted.show(this.$t('stock.form.error.product-name-empty').toString(), errorToast);
                return;
            }

            if (payload.manufacturer === '' || payload.manufacturer === 'placeholder') {
                this.$toasted.show(this.$t('stock.form.error.product-manufacturer-invalid').toString(), errorToast);
                return;
            }

            if (payload.collection === '' || payload.collection === 'placeholder') {
                this.$toasted.show(this.$t('stock.form.error.product-collection-invalid').toString(), errorToast);
                return;
            }

            const productId: string = (await (this.$store.dispatch('stockCreateProduct', payload)));
            await this.$router.push(`${productId}`);
        }

        selectValidator(value: string): boolean {
            return value !== 'placeholder';
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

        onNewCollection(collection: ProductCollectionjsonld): void {
            this.collections();
            this.collection = collection['@id'];
        }

        onNewManufacturer(manufacturer: ProductManufacturerjsonld): void {
            this.manufacturers();
            this.manufacturer = manufacturer['@id'];
        }

        collections(): void {
            let data: Array<{label: string, value: string, disabled: boolean}> = [];
            for (let id in this.$store.state.Stock.collections) {
                data.push({ label: this.$store.state.Stock.collections[id].name, value: id, disabled: false });
            }

            const hint = '=== ' + this.$t('global.form.select-one').toString() + ' ===';
            data = data.sort((a,b) => a.label.localeCompare(b.label)); // Short items alphabetically.
            data.unshift({ label: hint, value: 'placeholder', disabled: true }); // Need to add this due ios.

            this.collectionsData = data;
        }

        manufacturers(): void {
            let data: Array<{label: string, value: string, disabled: boolean}> = [];
            for (let id in this.$store.state.Stock.manufacturers) {
                data.push({ label: this.$store.state.Stock.manufacturers[id].name, value: id, disabled: false });
            }

            const hint = '=== ' + this.$t('global.form.select-one').toString() + ' ===';
            data = data.sort((a,b) => a.label.localeCompare(b.label)); // Short items alphabetically.
            data.unshift({ label: hint, value: 'placeholder', disabled: true }); // Need to add this due ios.

            this.manufacturersData = data;
        }
    }
</script>

<style scoped>

</style>
