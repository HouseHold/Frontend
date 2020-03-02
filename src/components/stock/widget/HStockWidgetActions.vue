<template>
    <CRow>
        <CCol sm="6" lg="3">
            <CButton class="stock-action-btn" size="lg" color="primary" block>
                {{ $t('stock.form.button.show-in-stock') }}
            </CButton>
        </CCol>
        <CCol sm="6" lg="3">
            <CButton class="stock-action-btn" size="lg" color="info" block>
                {{ $t('stock.form.button.show-bellow-limit') }}
            </CButton>
        </CCol>
        <CCol sm="6" lg="3">
            <CButton class="stock-action-btn" size="lg" color="warning" block>
                {{ $t('stock.form.button.show-expiring') }}
            </CButton>
        </CCol>
        <CCol sm="6" lg="3">
            <CButton class="stock-action-btn" size="lg" color="danger" block>
                {{ $t('stock.form.button.show-expired') }}
            </CButton>
        </CCol>
    </CRow>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    @Component
    export default class HStockWidgetActions extends Vue {
        public readonly name: string = 'HStockWidgetActions';
    }
</script>

<style scoped>
    .stock-action-btn {
        margin-bottom: 10px;
    }
</style>
