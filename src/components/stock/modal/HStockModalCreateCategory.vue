<template>
    <CModal v-if="showModal" :show.sync="showModal" color="dark" :close-on-backdrop="false">
        <CRow>
            <CCol>
                <CForm>
                    <CInput required
                            v-model="category"
                            type="text"
                            :label="$t('stock.label.product-category')"
                            :placeholder="$t('stock.form.hint.enter-category-name')"
                            inline
                            :invalidFeedback="invalidCategory"
                            :is-valid="categoryValidator"
                    />
                </CForm>
            </CCol>
        </CRow>
        <template #header>
            <h6 class="modal-title">
                {{ $t('stock.title.product-create-category') }}
            </h6>
            <CButtonClose class="text-white" @click="cancelCreateCategory()" />
        </template>
        <template #footer>
            <CButton color="danger" @click="cancelCreateCategory()">
                {{ $t('global.button.cancel') }}
            </CButton>
            <CButton color="success" :disabled="false" @click="createCategory()">
                {{ $t('global.button.submit') }}
            </CButton>
        </template>
    </CModal>
</template>

<script lang="ts">
    import { Component, Prop, Emit, Vue } from "vue-property-decorator";
    import CreateProductCategory from "@/store/Stock/CreateProductCategory";
    import { ProductCategoryjsonld } from "@household/api-client";

    @Component
    export default class HStockModalCreateCategory extends Vue {
        readonly name: string = 'HStockModalCreateCategory';
        @Prop(Boolean) showModal: boolean = false;
        category: string = '';
        invalidCategory: string = '';

        @Emit('close')
        closeModal(cancel: boolean) {
            this.category = '';
            this.invalidCategory = '';
            return cancel;
        }

        @Emit('created')
        createdCategory(category: ProductCategoryjsonld): ProductCategoryjsonld {
            return category;
        }

        cancelCreateCategory(): void {
            this.closeModal(true);
        }

        async createCategory(): Promise<void> {
            if (this.category === '' || !this.categoryValidator(this.category)) {
                return;
            }

            const payload: CreateProductCategory = {
                name: this.category,
            };
            const category: ProductCategoryjsonld = (await (this.$store.dispatch('stockCreateProductCategory', payload)));
            this.createdCategory(category);
            this.closeModal(false);
        }

        categoryValidator(val: string): boolean {
            if (val === '' ) {
                this.invalidCategory = this.$t('global.form.error-field-cannot-be-empty').toString();

                return false;
            }

            for (let id in this.$store.state.Stock.categories) {
                if (this.$store.state.Stock.categories[id].name.toLowerCase() === val.toLowerCase()) {
                    this.invalidCategory = this.$t('stock.form.error.product-category-must-unique').toString();

                    return false;
                }
            }

            return true;
        }
    }
</script>
