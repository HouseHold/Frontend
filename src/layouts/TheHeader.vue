<template>
  <CHeader
    fixed
    with-subheader
    light
  >
    <CToggler
      v-c-emit-root-event:toggle-sidebar-mobile
      in-header
      class="ml-3 d-lg-none"
    />
    <CToggler
      v-c-emit-root-event:toggle-sidebar
      in-header
      class="ml-3 d-md-down-none"
    />
    <CHeaderBrand
      class="mx-auto d-lg-none"
      width="190"
      height="46"
      src="//via.placeholder.com/190x46"
      alt="HouseHold Logo"
    />
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink
          to="/users"
          exact
        >
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink
          to="/settings"
          exact
        >
          Settings
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell" />
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-list" />
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <div v-if="this.$store.state.Stock.lock">
            <CIcon
              class="spinning"
              name="cil-reload"
            />
          </div>
          <div
            v-else
            @click="refreshData"
          >
            <CIcon
              name="cil-reload"
            />
          </div>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt />
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0" />
    </CSubheader>
  </CHeader>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt.vue';

@Component({
  components: {
    TheHeaderDropdownAccnt
  }
})
export default class TheHeader extends Vue {
  name:string = 'TheHeader';

  async refreshData() {
    await this.$store.dispatch('lockStocks');
    await this.$store.dispatch('fetchStocks');
  }
}
</script>
