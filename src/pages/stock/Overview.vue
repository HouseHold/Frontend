<template>
    <div>
        <h-stock-widget-item-count />
        <h-stock-widget-actions />
        <hr>
        <h-stock-table-products />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import HStockWidgetItemCount from "@/components/stock/widget/HStockWidgetItemCount.vue";
    import HStockWidgetActions from '@/components/stock/widget/HStockWidgetActions.vue';
    import HStockTableProducts from "@/components/stock/table/HStockTableProducts.vue";

    @Component({
      components: {
        HStockWidgetItemCount,
        HStockWidgetActions,
        HStockTableProducts
      }
    })
    export default class StockOverview extends Vue {
      readonly name: string = 'StockOverview';
    }
</script>
