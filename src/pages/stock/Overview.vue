<template>
    <div>
        <widgets-stock />
        <widgets-actions />
        <hr>
        <in-stock />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import WidgetsStock from '@/components/stock/WidgetStock.vue'
    import InStock from '@/components/stock/InStock.vue';
    import WidgetsActions from '@/components/stock/WidgetActions.vue';

    @Component({
      components: {
        WidgetsStock,
        InStock,
        WidgetsActions
      }
    })
    export default class StockOverview extends Vue {
      readonly name: string = 'StockOverview';
    }
</script>
