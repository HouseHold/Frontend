<template>
  <CRow>
    <CCol
      sm="6"
      lg="3"
    >
      <CWidgetDropdown
        color="primary"
        header="0"
        text="Stock"
      >
        <template #footer>
          <ChartLine
            pointed
            class="mt-3 mx-3"
            style="height:70px"
            :data-points="[65, 59, 84, 84, 51, 55, 40]"
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
            :data-points="[1, 18, 9, 17, 34, 22, 11]"
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
        header="0"
        text="Expiring"
      >
        <template #footer>
          <ChartLine
            class="mt-3"
            style="height:70px"
            background-color="rgba(255,255,255,.2)"
            :data-points="[78, 81, 80, 45, 34, 12, 40]"
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
        header="0"
        text="Expired"
      >
        <template #footer>
          <ChartBar
            class="mt-3 mx-3"
            style="height:70px"
            background-color="rgb(250, 152, 152)"
            label="Spoiled"
            labels="months"
          />
        </template>
      </CWidgetDropdown>
    </CCol>
  </CRow>
</template>

<script>
  import ChartLine from "@/components/chart/ChartLine";
  import ChartBar from "@/components/chart/ChartBar";
    export default {
        name: 'StockWidgetStock',
        components: {ChartBar, ChartLine}
    }
</script>
