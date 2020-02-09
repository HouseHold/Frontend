<template>
    <div id="stock-product-edit-form">
        <CForm>
            <CInput> Hello there! </CInput>
        </CForm>
    </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {Productjsonld} from "@household/api-client";

    @Component
    export default class StockProduct extends Vue {
        readonly name: string = 'ProductEdit';
        //@ts-ignore Would cause is do otherwise extra checking for nothing...
        @Prop(Object) readonly product: Productjsonld;
    }
</script>

<style scoped>

</style>
