<template>
    <div class="c-app">
        <TheSidebar />
        <div class="c-wrapper c-fixed-components">
            <TheHeader />
            <div class="c-body">
                <main class="c-main">
                    <CContainer fluid>
                        <transition name="fade">
                            <router-view />
                        </transition>
                    </CContainer>
                </main>
            </div>
            <TheFooter />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TheSidebar from './TheSidebar.vue';
import TheHeader from './TheHeader.vue';
import TheFooter from './TheFooter.vue';

@Component({
  name: 'TheContainer',

  components: {
    TheSidebar,
    TheHeader,
    TheFooter
  }
})
export default class TheContainer extends Vue {}
</script>

<style lang="scss">
  @import '../assets/scss/style';
  .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
