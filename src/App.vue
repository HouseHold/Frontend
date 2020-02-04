<template>
  <router-view />
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    @Component
    export default class App extends Vue {
      readonly name: string = 'App';
      created() {
        // TODO: Replace with once per hour and optional refresh button.
        window.setInterval(async () => {
          if(this.$store.state.Stock.updated < (Date.now()-120000) && !this.$store.state.Stock.lock && !document.hidden) {
            await this.$store.dispatch('lockStocks');
            await this.$store.dispatch('fetchStocks');
          }
        }, 1000);
      }
    }
</script>

<style lang="scss">
    // Import Main styles for this application
    @import 'assets/scss/style';
</style>
