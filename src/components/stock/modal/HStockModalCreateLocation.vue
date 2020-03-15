<template>
    <CModal v-if="showModal" :show.sync="showModal" color="dark" :close-on-backdrop="false">
        <CRow>
            <CCol>
                <CForm>
                    <CInput v-model="location"
                            required
                            type="text"
                            :label="$t('stock.label.product-location')"
                            :placeholder="$t('stock.form.hint.enter-location-name')"
                            inline
                            :invalid-feedback="invalidLocation"
                            :is-valid="locationValidator"
                    />
                </CForm>
            </CCol>
        </CRow>
        <template #header>
            <h6 class="modal-title">
                {{ $t('stock.title.product-create-location') }}
            </h6>
            <CButtonClose class="text-white" @click="cancelCreateLocation()" />
        </template>
        <template #footer>
            <CButton color="danger" @click="cancelCreateLocation()">
                {{ $t('global.button.cancel') }}
            </CButton>
            <CButton color="success" :disabled="false" @click="createLocation()">
                {{ $t('global.button.submit') }}
            </CButton>
        </template>
    </CModal>
</template>

<script lang="ts">
    import { Component, Prop, Emit, Vue } from "vue-property-decorator";
    import CreateProductLocation from "@/store/Stock/CreateProductLocation";
    import { ProductLocationjsonld } from "@household/api-client";

    @Component
    export default class HStockModalCreateLocation extends Vue {
        readonly name: string = 'HStockModalCreateLocation';
        @Prop(Boolean) showModal: boolean = false;
        location: string = '';
        invalidLocation: string = '';

        @Emit('close')
        closeModal(cancel: boolean) {
            this.location = '';
            this.invalidLocation = '';
            return cancel;
        }

        @Emit('created')
        createdLocation(location: ProductLocationjsonld): ProductLocationjsonld {
            return location;
        }

        cancelCreateLocation(): void {
            this.closeModal(true);
        }

        async createLocation(): Promise<void> {
            if (this.location === '' || !this.locationValidator(this.location)) {
                return;
            }

            const payload: CreateProductLocation = {
                name: this.location,
            };
            const location: ProductLocationjsonld = (await (this.$store.dispatch('stockCreateProductLocation', payload)));
            this.createdLocation(location);
            this.closeModal(false);
        }

        locationValidator(val: string): boolean {
            if (val === '' ) {
                this.invalidLocation = this.$t('global.form.error-field-cannot-be-empty').toString();

                return false;
            }

            for (let id in this.$store.state.Stock.locations) {
                if (this.$store.state.Stock.locations[id].name.toLowerCase() === val.toLowerCase()) {
                    this.invalidLocation = this.$t('stock.form.error.product-location-must-unique').toString();

                    return false;
                }
            }

            return true;
        }
    }
</script>
