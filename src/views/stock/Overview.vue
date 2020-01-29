<template>
    <div>
        <widgets-stock/>
        <widgets-actions/>
        <hr/>
        <in-stock/>
    </div>
</template>

<script>
    import WidgetsStock from './widget/Stock'
    import InStock from "./table/InStock";
    import WidgetsActions from "./widget/Actions";

    export default {
        name: 'Stock',
        components: {
            WidgetsStock,
            WidgetsActions,
            InStock
        }
    }
</script>
