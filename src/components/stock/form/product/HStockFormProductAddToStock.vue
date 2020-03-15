<template>
    <CCard>
        <CCardHeader>
            <strong>{{ $t('stock.label.add-product-to-stock') }}</strong>
        </CCardHeader>
        <CCardBody>
            <CForm>
                <div class="form-group">
                    <label>
                        {{ $t('stock.label.product') }}
                    </label>
                    <v-select :options="products" @input="onProductInput" />
                </div>
                <div v-if="form.product !== null && this.$store.state.Stock.products[form.product].expiring" class="form-group">
                    <label style="margin-top: 10px">
                        {{ $t('stock.label.best-before') }}
                    </label>
                    <date-picker
                        v-model="form.bestBefore"
                        mode="single"
                        :attributes="pickerAttrs"
                    />
                </div>
                <CInput
                    v-model="form.quantity"
                    :label="$t('stock.label.amount')"
                    :placeholder="$t('stock.form.hint.enter-amount')"
                    type="number"
                    :invalid-feedback="$t('stock.form.error.amount-in-numbers')"
                    :is-valid="isNumber"
                />
                <CInput
                    v-model="form.price"
                    :label="$t('stock.label.price')"
                    :placeholder="$t('stock.form.hint.enter-price')"
                    type="number"
                    step=".01"
                    :invalid-feedback="$t('stock.form.error.price-in-numbers')"
                    :is-valid="isNumber"
                />
                <CRow v-if="form.product !== null">
                    <CCol>
                        <template v-if="stocksData.length !== 0">
                            <div class="col-xs-1 modal-row" align="center">
                                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label
                                            v-for="stock in stocksData"
                                            :key="stock['@id']"
                                            class="btn btn-primary"
                                            :class="{ active: stock['@id'] === form.stock}"
                                    >
                                        <input :id="stock['@id']"
                                               type="radio"
                                               name="options"
                                               :checked="stock['@id'] === form.stock"
                                               @click="onSelectedStock(stock)"
                                        >
                                        {{ $store.state.Stock.locations[stock.location].name }}
                                    </label>
                                    <label class="btn btn-success">
                                        <input type="radio" name="options" :checked="false" @click="showCreateStockModal = !showCreateStockModal">
                                        {{ $t('global.button.new') }}
                                    </label>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="col-xs-1 modal-row" align="center">
                                <CButton color="success" @click="showCreateStockModal = !showCreateStockModal">{{ $t('stock.label.new-location') }}</CButton>
                            </div>
                        </template>
                        <h-stock-modal-create-stock
                                :show-modal="showCreateStockModal"
                                :product="form.product"
                                @close="showCreateStockModal = false"
                                @created="stockCreated"
                        />
                    </CCol>
                </CRow>
                <hr>
                <CButton
                    block
                    color="success"
                    @click="onAddToStock()"
                >
                    {{ $t('global.button.submit') }}
                </CButton>
                <CButton
                    block
                    color="danger"
                    @click="returnToStock()"
                >
                    {{ $t('global.button.cancel') }}
                </CButton>
            </CForm>
        </CCardBody>
    </CCard>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import vSelect from "vue-select";
    import { ProductStockjsonld } from "@household/api-client";
    import AddProductToStock from "@/store/Stock/AddProductToStock";
    import HStockModalCreateStock from "@/components/stock/modal/HStockModalCreateStock.vue";

    interface AddProductToStockData {
        stock: string | null;
        product: string | null;
        quantity: number | null;
        price: number | null;
        bestBefore: Date | null;
    }

    @Component({
        components: { HStockModalCreateStock, vSelect }
    })
    export default class HStockFormProductAddToStock extends Vue {
        readonly name: string = 'HStockFormProductAddToStock';
        readonly pickerAttrs: Array<object> = [
            {
                key: 'today',
                highlight: true,
                dates: new Date(),
            },
        ];

        showCreateStockModal: boolean = false;
        stocksData: Array<ProductStockjsonld> = [];

        form: AddProductToStockData = {
            stock: null,
            product: null,
            quantity: null,
            price: null,
            bestBefore: null,
        };

        stockCreated(stock: ProductStockjsonld): void {
            this.stocks();
            this.form.stock = stock["@id"];
        }

        onProductInput(event: {label: string, code: string}|null): void {
            if (event === null) {
                this.form.stock = null;
                this.form.product = null;
                this.form.quantity = null;
                this.form.price = null;
                this.form.bestBefore = null;

                return;
            }
            this.form.product = event.code;
            this.stocks();
        }

        onAddToStock(): void {
            if (typeof this.form.stock !== 'string') {
                return;
            }

            let payload: AddProductToStock = {
                bestBefore: this.form.bestBefore === null ? null : this.form.bestBefore.toISOString(),
                price: (Number(this.form.price).toFixed(2) as unknown) as number,
                quantity: Number(this.form.quantity),
                stock: this.form.stock
            };

            this.$store.dispatch('stockAddToStock', payload);
        }

        isNumber(val: any) {
            return Number(val) > 0;
        }

        returnToStock() {
            this.$router.push("overview");
        }

        onSelectedStock(stock: ProductStockjsonld) {
            this.form.stock = this.form.stock === stock['@id'] ? null : this.form.stock = stock['@id'];
        }

        get products(): Array<{ label: string, code: string }> {
            let data = [];
            for (let productId in this.$store.state.Stock.products) {
                data.push({ label: this.$store.state.Stock.products[productId].name, code: productId });
            }

            return data;
        }

        stocks(): void {
            if (this.form.product === null) {
                return;
            }

            let data: Array<ProductStockjsonld> = [];
            this.$store.state.Stock.products[this.form.product].stocks.forEach((key: string) => {
                data.push(this.$store.state.Stock.stocks[key]);
            });

            this.stocksData = data;
        }
    }
</script>
