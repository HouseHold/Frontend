<template>
    <div>
        <c-row>
            <CCol sm="8">
                <AddProductToStock/>
            </CCol>
            <CCol sm="4">
                <CCard>
                    <CCardHeader>
                        <strong>Product Overview</strong>
                    </CCardHeader>
                    <CCardBody>
                        <p>WIP</p>
                    </CCardBody>
                </CCard>
            </CCol>
        </c-row>
    </div>
</template>

<script>
    import AddProductToStock from "./purchase/AddProductToStock";

    export default {
        name: 'StockPurchase',
        components: {
            AddProductToStock
        },
    }
</script>
