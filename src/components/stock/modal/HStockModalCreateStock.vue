<template>
    <CModal v-if="showModal" :show.sync="showModal" color="dark" :close-on-backdrop="false">
        <CRow>
            <CCol>
                <CForm>
                    <CSelect
                        :value.sync="location"
                        :label="$t('stock.label.product-location')"
                        :description="$t('stock.form.desc.please-give-product-location')"
                        :options="locationsData"
                    >
                        <template #append>
                            <CButton color="success" @click="showCreateLocationModal = !showCreateLocationModal">
                                {{ $t('global.button.new') }}
                            </CButton>
                        </template>
                    </CSelect>
                </CForm>
            </CCol>
        </CRow>
        <template #header>
            <h6 class="modal-title">
                {{ $t('stock.title.product-create-stock') }}
            </h6>
            <CButtonClose class="text-white" @click="cancelCreateStock()" />
        </template>
        <template #footer>
            <CButton color="danger" @click="cancelCreateStock()">
                {{ $t('global.button.cancel') }}
            </CButton>
            <CButton color="success" :disabled="false" @click="createStock()">
                {{ $t('global.button.submit') }}
            </CButton>
        </template>
        <h-stock-modal-create-location
            :show-modal="showCreateLocationModal"
            @created="locationCreated"
            @close="showCreateLocationModal = false"
        />
    </CModal>
</template>

<script lang="ts">
    import { Component, Prop, Emit, Vue } from "vue-property-decorator";
    import { ProductLocationjsonld, ProductStockjsonld } from "@household/api-client";
    import CreateProductStock from "@/store/Stock/CreateProductStock";
    import HStockModalCreateLocation from "@/components/stock/modal/HStockModalCreateLocation.vue";
    @Component({
        components: { HStockModalCreateLocation }
    })
    export default class HStockModalCreateStock extends Vue {
        readonly name: string = 'HStockModalCreateStock';

        //@ts-ignore This should cause fatal if not set, due it will be programmer error to not define this.
        @Prop(String) product: string;
        @Prop(Boolean) showModal: boolean = false;
        location: string = 'placeholder';
        locationsData: Array<{label: string, value: string, disabled: boolean}> = [];
        invalidLocation: string = '';
        showCreateLocationModal: boolean = false;

        mounted(): void {
            this.locations();
        }

        @Emit('close')
        closeModal(cancel: boolean) {
            this.location = '';
            this.invalidLocation = '';
            return cancel;
        }

        locationCreated(location: ProductLocationjsonld): void {
            this.locations();
            this.location = location["@id"];
        }

        @Emit('created')
        createdStock(stock: ProductStockjsonld): ProductStockjsonld {
            return stock;
        }

        cancelCreateStock(): void {
            this.closeModal(true);
        }

        async createStock(): Promise<void> {
            if (!this.categoryValidator(this.location)) {
                return;
            }

            const payload: CreateProductStock = {
                location: this.location,
                product: this.product,
            };
            const stock: ProductStockjsonld = (await (this.$store.dispatch('stockCreateProductStock', payload)));
            await this.$store.dispatch('stockRefreshProduct', this.product);
            this.createdStock(stock);
            this.closeModal(false);
        }

        categoryValidator(val: string): boolean {
            if (val === '' ) {
                this.invalidLocation = this.$t('global.form.error-field-cannot-be-empty').toString();

                return false;
            }

            return true;
        }

        locations(): void {
            let location: Array<{label: string, value: string, disabled: boolean}> = [];

            // noinspection JSIncompatibleTypesComparison
            if (this.product === '' || this.product === undefined) {
                throw new Error('This is a bug. Somebody did not defined required property `product` with iri!');
            }

            for (let id in this.$store.state.Stock.locations) {
                //for (let stockId in this.$store.state.Stock.products[this.product].stocks) {
                //    if (this.$store.state.Stock.locations[id].stocks.includes(stockId)) {
                //        location.push({ label: this.$store.state.Stock.locations[id].name, value: id, disabled: false });
                //    }
                //}

                location.push({ label: this.$store.state.Stock.locations[id].name, value: id, disabled: false });
            }

            const hint = '=== ' + this.$t('global.form.select-one').toString() + ' ===';
            location = location.sort((a,b) => a.label.localeCompare(b.label)); // Short items alphabetically.
            location.unshift({ label: hint, value: 'placeholder', disabled: true }); // Need to add this due ios.

            this.locationsData = location;
        }
    }
</script>
