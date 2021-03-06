<template>
    <CModal v-if="showModal" :show.sync="showModal" :title="title" :color="color" :close-on-backdrop="false">
        <CRow>
            <CCol>
                <div class="col-xs-1 modal-row" align="center">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label
                            v-for="stock in stocks"
                            :key="stock['@id']"
                            class="btn btn-primary"
                            :class="{ active: stock['@id'] === selectedStock}"
                        >
                            <input :id="stock['@id']"
                                   type="radio"
                                   name="options"
                                   :checked="stock['@id'] === selectedStock"
                                   @click="onSelectedStock(stock)"
                            >
                            {{ $store.state.Stock.locations[stock.location].name }}
                        </label>
                    </div>
                </div>
            </CCol>
        </CRow>
        <CRow v-if="product.expiring === true && '' !== selectedStock">
            <CCol>
                <div class="col-xs-1 modal-row" align="center">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label
                            v-for="(amount, date) in $store.state.Stock.stocks[selectedStock].bestBefore"
                            :key="date"
                            class="btn btn-primary"
                            :class="{ active: date === selectedBestBefore}"
                        >
                            <input :id="date"
                                   type="radio"
                                   name="options"
                                   :checked="date === selectedBestBefore"
                                   @click="onSelectBestBefore(date, amount)"
                            >
                            {{ date }} ({{ amount }})
                        </label>
                    </div>
                </div>
            </CCol>
        </CRow>
        <CRow v-if="(product.expiring === true && selectedBestBefore !== '')
            || (product.expiring === false && '' !== selectedStock)"
        >
            <CCol class="col-xs-4" align="center">
                <CButton color="danger" @click="onDecreaseConsumeQuantity()">
                    <b>-</b>
                </CButton>
            </CCol>
            <CCol class="col-xs-6 inStock-align-center" align="center">
                <div class="input-text-center">
                    <CInput v-model="selectedQuantity" type="number" min="0"
                            :max="selectedMaxQuantity"
                            :append="maxAppend"
                            @blur="validateSelectedQuantity()"
                    />
                </div>
            </CCol>
            <CCol class="col-xs-4" align="center">
                <CButton color="success" @click="onIncreaseConsumeQuantity()">
                    <b>+</b>
                </CButton>
            </CCol>
        </CRow>
        <template #header>
            <h6 class="modal-title">
                {{ $t('stock.label.product-consume-product', { product: product.name }) }}
            </h6>
            <CButtonClose class="text-white" @click="cancelConsumeProduct()" />
        </template>
        <template #footer>
            <CButton color="danger" @click="cancelConsumeProduct()">
                {{ $t('global.button.cancel') }}
            </CButton>
            <CButton color="success" :disabled="selectedQuantity === 0" @click="consumeProduct()">
                {{ $t('stock.form.button.consume') }}
            </CButton>
        </template>
    </CModal>
</template>

<script lang="ts">
    import { Component, Prop, Emit, Vue } from "vue-property-decorator";
    import { Productjsonld, ProductStockjsonld } from "@household/api-client";
    import ConsumeProduct from "@/store/Stock/ConsumeProduct";

    @Component
    export default class HStockModalConsume extends Vue {
        readonly name: string = 'HStockModalConsume';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Object) readonly product: Productjsonld;
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Boolean) showModal: boolean;
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(String) readonly title: string;
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(String) readonly color: string = 'dark';
        @Prop(Object) readonly stock: ProductStockjsonld|undefined;
        @Prop(Object) readonly bestBefore: {date: string, amount: number}|undefined;

        mounted() {
            if (this.stock !== undefined) {
                this.onSelectedStock(this.stock);
                if (this.product.expiring && this.bestBefore !== undefined) {
                    this.onSelectBestBefore(this.bestBefore.date, String(this.bestBefore.amount));
                }
            }
        }

        @Emit('close')
        closeModal(cancel: boolean) {
            this.selectedStock = '';
            this.selectedBestBefore = '';
            this.selectedQuantity = 0;
            this.selectedMaxQuantity = 2147483647;
            return cancel;
        }

        selectedStock: string = '';
        selectedBestBefore: string = '';
        selectedQuantity: number = 0;
        selectedMaxQuantity: number = 2147483647;

        cancelConsumeProduct() {
            this.closeModal(true);
        }

        consumeProduct() {
            this.validateSelectedQuantity();
            const payload: ConsumeProduct = {
                stockId: this.selectedStock,
                bestBefore: this.product.expiring ? this.selectedBestBefore : null,
                quantity: Number(this.selectedQuantity)
            };
            this.$store.dispatch('stockConsumeProduct', payload);
            this.closeModal(false);
        }

        onDecreaseConsumeQuantity() {
            if (this.selectedQuantity === 0) {
                return;
            }
            --this.selectedQuantity;
        }

        onIncreaseConsumeQuantity() {
            if (this.selectedQuantity === this.selectedMaxQuantity) {
                return;
            }
            ++this.selectedQuantity;
        }

        onSelectBestBefore(date: string, amount: string) {
            this.selectedBestBefore = date;
            this.selectedMaxQuantity = parseInt(amount);
        }

        onSelectedStock(stock: ProductStockjsonld) {
            this.selectedStock = stock['@id'];
            this.selectedMaxQuantity = stock.quantity;
        }

        validateSelectedQuantity() {
            if (this.selectedQuantity > this.selectedMaxQuantity && this.selectedMaxQuantity !== 2147483647) {
                this.selectedQuantity = this.selectedMaxQuantity;
            }
        }

        get maxAppend() {
            return "/ "+this.selectedMaxQuantity
        }

        get stocks(): Array<ProductStockjsonld> {
            let data: Array<ProductStockjsonld> = [];
            this.product.stocks.forEach((key: string) => {
                data.push(this.$store.state.Stock.stocks[key]);
            });

            return data;
        }
    }
</script>

<style scoped>
    .modal-row {
        margin-bottom: 25px;
    }
    .input-text-center {
        display: inline-block;
        float: none;
        margin: 0 auto;
    }
    .inStock-align-center {
        text-align: center;
    }
</style>
