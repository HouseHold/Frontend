<template>
    <CModal v-if="showModal" :show.sync="showModal" color="dark" :close-on-backdrop="false">
        <CRow>
            <CCol>
                <CForm>
                    <CInput v-model="collection"
                            required
                            type="text"
                            :label="$t('stock.label.product-collection')"
                            :placeholder="$t('stock.form.hint.enter-collection-name')"
                            inline
                            :invalid-feedback="invalidCollection"
                            :is-valid="collectionValidator"
                    />
                    <CSelect
                        :value.sync="category"
                        :label="$t('stock.label.product-category')"
                        :description="$t('stock.form.desc.please-give-product-category')"
                        :options="categoriesData"
                    >
                        <template #append>
                            <CButton color="success" @click="createCategoryModal = !createCategoryModal">
                                {{ $t('global.button.new') }}
                            </CButton>
                        </template>
                    </CSelect>
                </CForm>
            </CCol>
        </CRow>
        <template #header>
            <h6 class="modal-title">
                {{ $t('stock.title.product-create-collection') }}
            </h6>
            <CButtonClose class="text-white" @click="cancelCreateCollection()" />
        </template>
        <template #footer>
            <CButton color="danger" @click="cancelCreateCollection()">
                {{ $t('global.button.cancel') }}
            </CButton>
            <CButton color="success" :disabled="false" @click="createCollection()">
                {{ $t('global.button.submit') }}
            </CButton>
        </template>
        <h-stock-modal-create-category
            :show-modal="createCategoryModal"
            @close="createCategoryModal = false"
            @created="onNewCategory"
        />
    </CModal>
</template>

<script lang="ts">
    import { Component, Prop, Emit, Vue } from "vue-property-decorator";
    import CreateProductCollection from "@/store/Stock/CreateProductCollection";
    import HStockModalCreateCategory from "@/components/stock/modal/HStockModalCreateCategory.vue";
    import { ProductCategoryjsonld, ProductCollectionjsonld } from "@household/api-client";

    @Component({
        components: { HStockModalCreateCategory }
    })
    export default class HStockModalCreateCollection extends Vue {
        readonly name: string = 'HStockModalCreateCollection';
        @Prop(Boolean) showModal: boolean = false;
        collection: string = '';
        category: string = 'placeholder';
        invalidCollection: string = '';
        createCategoryModal: boolean = false;
        categoriesData: Array<{label: string, value: string, disabled: boolean}> = [];

        mounted() {
            this.categories();
        }

        onNewCategory(category: ProductCategoryjsonld): void {
            this.categories();
            this.category = category["@id"];
        }

        @Emit('close')
        closeModal(cancel: boolean) {
            this.collection = '';
            this.category = '';
            this.invalidCollection = '';
            return cancel;
        }

        @Emit('created')
        createdCollection(collection: ProductCollectionjsonld): ProductCollectionjsonld {
            return collection;
        }

        cancelCreateCollection(): void {
            this.closeModal(true);
        }

        async createCollection(): Promise<void> {
            if (this.category === 'placeholder' || this.category === '' || !this.collectionValidator(this.collection)) {
                return;
            }

            const payload: CreateProductCollection = {
                category: this.category,
                name: this.collection,
            };
            const collectionId: ProductCollectionjsonld = (await (this.$store.dispatch('stockCreateProductCollection', payload)));
            this.createdCollection(collectionId);
            this.closeModal(false);
        }

        collectionValidator(val: string): boolean {
            if (val === '' ) {
                this.invalidCollection = this.$t('global.form.error-field-cannot-be-empty').toString();

                return false;
            }

            for (let id in this.$store.state.Stock.collections) {
                if (this.$store.state.Stock.collections[id].name.toLowerCase() === val.toLowerCase()) {
                    this.invalidCollection = this.$t('stock.form.error.product-collection-must-unique').toString();

                    return false;
                }
            }

            return true;
        }

        categories(): void {
            let category: Array<{label: string, value: string, disabled: boolean}> = [];

            for (let id in this.$store.state.Stock.categories) {
                category.push({ label: this.$store.state.Stock.categories[id].name, value: id, disabled: false });
            }

            const hint = '=== ' + this.$t('global.form.select-one').toString() + ' ===';
            category = category.sort((a,b) => a.label.localeCompare(b.label)); // Short items alphabetically.
            category.unshift({ label: hint, value: 'placeholder', disabled: true }); // Need to add this due ios.

            this.categoriesData = category;
        }
    }
</script>
