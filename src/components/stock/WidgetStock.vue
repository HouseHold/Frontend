<template>
    <CRow>
        <CCol
            sm="6"
            lg="3"
        >
            <CWidgetDropdown
                color="primary"
                :header="inStock"
                text="Stock"
            >
                <template #footer>
                    <ChartLine
                        pointed
                        class="mt-3 mx-3"
                        style="height:70px"
                        :data-points="[0, 0, 0, 0, 0, 0, 0]"
                        point-hover-background-color="primary"
                        label="Total Stock"
                        labels="months"
                    />
                </template>
            </CWidgetDropdown>
        </CCol>
        <CCol
            sm="6"
            lg="3"
        >
            <CWidgetDropdown
                color="info"
                header="0"
                text="Bellow limit"
            >
                <template #footer>
                    <ChartLine
                        pointed
                        class="mt-3 mx-3"
                        style="height:70px"
                        :data-points="[0, 0, 0, 0, 0, 0, 0]"
                        point-hover-background-color="info"
                        :options="{ elements: { line: { tension: 0.00001 }}}"
                        label="Bellow Limit"
                        labels="months"
                    />
                </template>
            </CWidgetDropdown>
        </CCol>
        <CCol
            sm="6"
            lg="3"
        >
            <CWidgetDropdown
                color="warning"
                :header="expiring"
                text="Expiring"
            >
                <template #footer>
                    <ChartLine
                        class="mt-3"
                        style="height:70px"
                        background-color="rgba(255,255,255,.2)"
                        :data-points="[0, 0, 0, 0, 0, 0, 0]"
                        :options="{ elements: { line: { borderWidth: 2.5 }}}"
                        point-hover-background-color="warning"
                        label="Expiring"
                        labels="months"
                    />
                </template>
            </CWidgetDropdown>
        </CCol>
        <CCol
            sm="6"
            lg="3"
        >
            <CWidgetDropdown
                color="danger"
                :header="spoiled"
                text="Spoiled"
            >
                <template #footer>
                    <ChartBar
                        class="mt-3 mx-3"
                        style="height:70px"
                        background-color="rgb(250, 152, 152)"
                        :data-points="[5, 5, 5, 5, 5, 5, 5]"
                        label="Spoiled"
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
    components: {ChartBar, ChartLine}
  })
  export default class StockWidgetStock extends Vue {
    public readonly name: string = 'StockWidgetStock';

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
      for (let productId in this.$store.state.Stock.products) {
        if (this.$store.state.Stock.products[productId].expiring) {
          this.$store.state.Stock.products[productId].stocks.forEach((stockId: string) => {
            for (let bestBeforeDate in this.$store.state.Stock.stocks[stockId].bestBefore) {
              if (Date.parse(bestBeforeDate) < threeDaysFromNow) {
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
