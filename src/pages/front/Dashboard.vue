<template>
    <div>
        <h1>TODO</h1>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class Dashboard extends Vue {
    readonly name: string = 'FrontDashboard'
  }
</script>
