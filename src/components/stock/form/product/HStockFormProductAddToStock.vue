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
                    <!-- Placeholder issue: https://github.com/nathanreyes/v-calendar/issues/493 -->
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
                        <div class="col-xs-1 modal-row" align="center">
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label
                                    v-for="stock in stocks"
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
                            </div>
                        </div>
                    </CCol>
                </CRow>
                <hr>
                <CButton
                    block
                    color="success"
                    @click="onAddToStock()"
                >
                    Submit
                </CButton>
                <CButton
                    block
                    color="danger"
                    @click="returnToStock()"
                >
                    Cancel
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

    interface AddProductToStockData {
        stock: string | null;
        product: string | null;
        quantity: number | null;
        price: number | null;
        bestBefore: string | null;
    }

    @Component({
        components: { vSelect }
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

        form: AddProductToStockData = {
            stock: null,
            product: null,
            quantity: null,
            price: null,
            bestBefore: null,
        };

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
        }

        onAddToStock(): void {
            if (typeof this.form.stock !== 'string') {
                throw Error('Stock id cannot be null.');
            }
            let payload: AddProductToStock = {
                bestBefore: this.form.bestBefore,
                price: Number(this.form.price),
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

        get stocks(): Array<ProductStockjsonld> {
            if (this.form.product === null) {
                return [];
            }

            let data: Array<ProductStockjsonld> = [];
            // @ts-ignore
            this.$store.state.Stock.products[this.form.product].stocks.forEach((key: string) => {
                data.push(this.$store.state.Stock.stocks[key]);
            });

            return data;
        }
    }
</script>
