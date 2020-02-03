<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show.sync="show"
  >
    <CSidebarBrand
      :img-full="{ width: 118, height: 46, alt: 'Logo', src: '//via.placeholder.com/118x46'}"
      :img-minimized="{ width: 118, height: 46, alt: 'Logo', src: '//via.placeholder.com/118x46'}"
      :wrapped-in-link="{ href: 'https://github.com/HouseHold/HouseHold', target: '_blank'}"
    />
    <CRenderFunction
      flat
      :content-to-render="nav"
    />
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="minimize = !minimize"
    />
  </CSidebar>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import nav from './_nav'

    @Component({
        name: 'TheSidebar'
    })
    export default class TheSidebar extends Vue {
        minimize = false;
        nav = nav;
        show = 'responsive';

        mounted() {
            this.$root.$on('toggle-sidebar', () => {
                //@ts-ignore
                const sidebarOpened = this.show === true || this.show === 'responsive';
                //@ts-ignore
                this.show = sidebarOpened ? false : 'responsive'
            });
            this.$root.$on('toggle-sidebar-mobile', () => {
                //@ts-ignore
                const sidebarClosed = this.show === 'responsive' || this.show === false;
                //@ts-ignore
                this.show = sidebarClosed ? true : 'responsive'
            })
        }
    }
</script>
