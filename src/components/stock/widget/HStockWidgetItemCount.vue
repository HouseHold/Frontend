<template>
    <CRow>
        <CCol sm="6" lg="3">
            <CWidgetDropdown color="primary" :header="inStock" :text="$t('stock.title.stock')">
                <template #footer>
                    <ChartLine
                        pointed
                        class="mt-3 mx-3"
                        style="height:70px"
                        :data-points="[0, 0, 0, 0, 0, 0, 0]"
                        point-hover-background-color="primary"
                        :label="$t('stock.label.stock-total')"
                        labels="months"
                    />
                </template>
            </CWidgetDropdown>
        </CCol>
        <CCol sm="6" lg="3">
            <CWidgetDropdown color="info" header="0" :text="$t('stock.label.bellow-limit')">
                <template #footer>
                    <ChartLine
                        pointed
                        class="mt-3 mx-3"
                        style="height:70px"
                        :data-points="[0, 0, 0, 0, 0, 0, 0]"
                        point-hover-background-color="info"
                        :options="{ elements: { line: { tension: 0.00001 }}}"
                        :label="$t('stock.label.bellow-limit')"
                        labels="months"
                    />
                </template>
            </CWidgetDropdown>
        </CCol>
        <CCol sm="6" lg="3">
            <CWidgetDropdown color="warning" :header="expiring" :text="$t('stock.label.expiring')">
                <template #footer>
                    <ChartLine
                        class="mt-3"
                        style="height:70px"
                        background-color="rgba(255,255,255,.2)"
                        :data-points="[0, 0, 0, 0, 0, 0, 0]"
                        :options="{ elements: { line: { borderWidth: 2.5 }}}"
                        point-hover-background-color="warning"
                        :label="$t('stock.label.expiring')"
                        labels="months"
                    />
                </template>
            </CWidgetDropdown>
        </CCol>
        <CCol
            sm="6"
            lg="3"
        >
            <CWidgetDropdown color="danger" :header="spoiled" :text="$t('stock.label.spoiled')">
                <template #footer>
                    <ChartBar
                        class="mt-3 mx-3"
                        style="height:70px"
                        background-color="rgb(250, 152, 152)"
                        :data-points="[5, 5, 5, 5, 5, 5, 5]"
                        :label="$t('stock.label.spoiled')"
                        labels="months"
                    />
                </template>
            </CWidgetDropdown>
        </CCol>
    </CRow>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import ChartLine from "@/components/chart/ChartLine.vue";
  import ChartBar from "@/components/chart/ChartBar.vue";
  @Component({
    components: { ChartBar, ChartLine }
  })
  export default class HStockWidgetItemCount extends Vue {
    public readonly name: string = 'HStockWidgetItemCount';

    get inStock(): string {
      let count = 0;
      for (let stockId in this.$store.state.Stock.stocks) {
        count += this.$store.state.Stock.stocks[stockId].quantity;
      }

      return String(count);
    }

    get expiring(): string {
      let count = 0;
      let threeDaysFromNow = Date.now() + 259200000; // 3 Days in milliseconds.
      let today = Date.now();
      for (let productId in this.$store.state.Stock.products) {
        if (this.$store.state.Stock.products[productId].expiring) {
          this.$store.state.Stock.products[productId].stocks.forEach((stockId: string) => {
            for (let bestBeforeDate in this.$store.state.Stock.stocks[stockId].bestBefore) {
              let bestBeforeParsed = Date.parse(bestBeforeDate);
              if (bestBeforeParsed < threeDaysFromNow && bestBeforeParsed > today) {
                count += this.$store.state.Stock.stocks[stockId].bestBefore[bestBeforeDate];
              }
            }
          });
        }
      }

      return String(count);
    }

    get spoiled(): string {
      let count = 0;
      let today = Date.now();
      for (let productId in this.$store.state.Stock.products) {
        if (this.$store.state.Stock.products[productId].expiring) {
          this.$store.state.Stock.products[productId].stocks.forEach((stockId: string) => {
            for (let bestBeforeDate in this.$store.state.Stock.stocks[stockId].bestBefore) {
              if (Date.parse(bestBeforeDate) < today) {
                count += this.$store.state.Stock.stocks[stockId].bestBefore[bestBeforeDate];
              }
            }
          });
        }
      }

      return String(count);
    }
  }
</script>
