<template>
  <div>
    <CRow>
      <CCol sm="12">
        <template v-if="this.$store.state.Stock.updated < 20">
          <c-spinner />
        </template>
        <template v-else>
          <CDataTable
            :items="items"
            :fields="fields"
            column-filter
            table-filter
            items-per-page-select
            hover
            sorter
            pagination
          >
            <template #consume="{item}">
              <td class="py-2">
                <CButton
                  color="danger"
                  variant="outline"
                  square
                  size="sm"
                  @click="prepareConsumeProduct(item)"
                >
                  Consume
                </CButton>
              </td>
            </template>
            <template #name="{item}">
              <td>
                <a class="clickable" @click="onClickProductName(item)">{{ item.name }}</a>
              </td>
            </template>
          </CDataTable>
          <CModal v-if="consumeModal" :show.sync="consumeModal" title="Consume product" color="dark" :close-on-backdrop="false">
            <CRow>
              <CCol>
                <div class="col-xs-1 modal-row" align="center">
                  <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label
                      v-for="stock in consumeModalStocks"
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
            <CRow v-if="consumeModalProduct.expiring === true && '' !== selectedStock">
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
            <CRow v-if="(consumeModalProduct.expiring === true && selectedBestBefore !== '')
              || (consumeModalProduct.expiring === false && '' !== selectedStock)"
            >
              <CCol class="col-xs-4" align="center">
                <CButton color="danger" @click="onDecreaseConsumeQuantity()">
                  <b>-</b>
                </CButton>
              </CCol>
              <CCol class="col-xs-6 inStock-align-center" align="center">
                <div class="input-text-center">
                  <CInput type="number" :value="selectedQuantity" min="0" :max="selectedMaxQuantity" :append="getMaxAppend()" />
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
                Consume {{ consumeModalProduct.name }}
              </h6>
              <CButtonClose
                class="text-white"
                @click="cancelConsumeProduct()"
              />
            </template>
            <template #footer>
              <CButton
                color="danger"
                @click="cancelConsumeProduct()"
              >
                Cancel
              </CButton>
              <CButton
                color="success"
                :disabled="selectedQuantity === 0"
                @click="consumeProduct()"
              >
                Consume
              </CButton>
            </template>
          </CModal>
        </template>
      </CCol>
    </CRow>
  </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {Api} from '@/lib';
    import {Productjsonld, ProductStockjsonld} from "@household/api-client";
    import ConsumeProduct from "@/store/Stock/ConsumeProduct";

    @Component
    export default class InStock extends Vue {
        name: string = 'InStock';
        consumeModal: boolean = false;
        consumeModalProduct?: Productjsonld = undefined;
        consumeModalStocks: Array<ProductStockjsonld> = [];
        consumeData?: ConsumeProduct = undefined;
        selectedStock: string = '';
        selectedBestBefore: string = '';
        selectedQuantity: number = 0;
        selectedMaxQuantity: number = 2147483647;
        fields: Array<Object> = [
            {key: 'consume', _style: 'width:10%', label: 'Actions', sorter: false, filter: false},
            {key: 'name', _style: 'width:40%'},
            {key: 'inStock', _style: 'width:10%;'},
            {key: 'bestBefore', _style: 'width:20%;'},
        ];

        get items(): Array<{ name: string, inStock: number, bestBefore: string, id: string }> {
            let data: Array<{ name: string, inStock: number, bestBefore: string, id: string }> = [];

            let products: { [key: string]: Productjsonld } = this.$store.state.Stock.products;
            for (let key in products) {
                let stocks: Array<ProductStockjsonld> = [];
                let quantity: number = 0;
                products[key].stocks.forEach((item) => {
                    stocks.push(this.$store.getters.stockById(item));
                });

                stocks.forEach((item) => {
                    quantity += item.quantity;
                });

                data.push({
                    name: products[key].name,
                    inStock: quantity,
                    bestBefore: 'Pew',
                    id: products[key]["@id"]
                });
            }

            return data;
        }

        onClickProductName(item: { name: string, inStock: number, bestBefore: string, id: string }) {
            this.$router.push('product/' + Api.Helpers.normalizeIri(item.id));
        }

        prepareConsumeProduct(item: { name: string, inStock: number, bestBefore: string, id: string }) {
          // Reset values
          this.consumeData = undefined;
          this.selectedQuantity = 0;
          this.selectedMaxQuantity = 2147483647;
          this.selectedStock = '';
          this.selectedBestBefore = '';
          this.consumeModalStocks = [];
          this.consumeModal = true;

          // Populate required data
          this.consumeModalProduct = this.$store.state.Stock.products[item.id];
          if (this.consumeModalProduct === undefined) {
            throw Error('Could not find product with id of '+item.id+'.');
          }
          this.consumeModalProduct.stocks.forEach((item) => {
            this.consumeModalStocks.push(this.$store.state.Stock.stocks[item]);
          });
        }

        cancelConsumeProduct() {
          this.consumeModal = false;
        }

        consumeProduct() {
          if(this.consumeModalProduct === undefined) {
            throw Error('No modal product selected. Consume product failed!');
          }

          const payload: ConsumeProduct = {
            stockId: this.selectedStock,
            bestBefore: this.consumeModalProduct.expiring ? this.selectedBestBefore : null,
            quantity: this.selectedQuantity
          };
          this.$store.dispatch('stockConsumeProduct', payload);
          this.cancelConsumeProduct();
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

      getMaxAppend() {
          return "/ "+this.selectedMaxQuantity
      }
    }
</script>

<style>
    .clickable {
        cursor: pointer;
    }
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
