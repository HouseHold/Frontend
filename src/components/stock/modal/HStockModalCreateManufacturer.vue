<template>
    <CModal v-if="showModal" :show.sync="showModal" color="dark" :close-on-backdrop="false">
        <CRow>
            <CCol>
                <CForm>
                    <CInput v-model="manufacturer"
                            required
                            type="text"
                            :label="$t('stock.label.product-manufacturer')"
                            :placeholder="$t('stock.form.hint.enter-manufacturer-name')"
                            inline
                            :invalid-feedback="invalidManufacturer"
                            :is-valid="manufacturerValidator"
                    />
                </CForm>
            </CCol>
        </CRow>
        <template #header>
            <h6 class="modal-title">
                {{ $t('stock.title.product-create-manufacturer') }}
            </h6>
            <CButtonClose class="text-white" @click="cancelCreateManufacturer()" />
        </template>
        <template #footer>
            <CButton color="danger" @click="cancelCreateManufacturer()">
                {{ $t('global.button.cancel') }}
            </CButton>
            <CButton color="success" :disabled="false" @click="createManufacturer()">
                {{ $t('global.button.submit') }}
            </CButton>
        </template>
    </CModal>
</template>

<script lang="ts">
    import { Component, Prop, Emit, Vue } from "vue-property-decorator";
    import { ProductManufacturerjsonld } from "@household/api-client";

    @Component
    export default class HStockModalCreateManufacturer extends Vue {
        readonly name: string = 'HStockModalCreateManufacturer';
        @Prop(Boolean) showModal: boolean = false;
        manufacturer: string = '';
        invalidManufacturer: string = '';

        @Emit('close')
        closeModal(cancel: boolean) {
            this.manufacturer = '';
            this.invalidManufacturer = '';
            return cancel;
        }

        @Emit('created')
        createdManufacturer(manufacturer: ProductManufacturerjsonld): ProductManufacturerjsonld {
            return manufacturer;
        }

        cancelCreateManufacturer(): void {
            this.closeModal(true);
        }

        async createManufacturer(): Promise<void> {
            if (this.manufacturer === '' || !this.manufacturerValidator(this.manufacturer)) {
                return;
            }

            const manufacturer: ProductManufacturerjsonld =
                (await (this.$store.dispatch('stockCreateProductManufacturer', this.manufacturer)));
            this.createdManufacturer(manufacturer);
            this.closeModal(false);
        }

        manufacturerValidator(val: string): boolean {
            if (val === '' ) {
                this.invalidManufacturer = this.$t('global.form.error-field-cannot-be-empty').toString();

                return false;
            }

            for (let id in this.$store.state.Stock.manufacturers) {
                if (this.$store.state.Stock.manufacturers[id].name.toLowerCase() === val.toLowerCase()) {
                    this.invalidManufacturer = this.$t('stock.form.error.product-manufacturer-must-unique').toString();

                    return false;
                }
            }

            return true;
        }
    }
</script>
