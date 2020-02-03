<template>
  <router-view />
</template>

<script lang="ts">

    import { Vue, Component } from "vue-property-decorator";

    @Component
    export default class App extends Vue {
      readonly name: string = 'App'
    }
</script>

<style lang="scss">
    // Import Main styles for this application
    @import 'assets/scss/style';
</style>
