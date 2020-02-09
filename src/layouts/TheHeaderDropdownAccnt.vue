<template>
    <CDropdown
        in-nav
        class="c-header-nav-items"
        placement="bottom-end"
        add-menu-classes="pt-0"
    >
        <template #toggler>
            <CHeaderNavLink>
                <div class="c-avatar">
                    <img
                        src="//via.placeholder.com/256x256"
                        class="c-avatar-img "
                    >
                </div>
            </CHeaderNavLink>
        </template>
        <CDropdownHeader
            tag="div"
            class="text-center"
            color="light"
        >
            <strong>Account</strong>
        </CDropdownHeader>
        <CDropdownItem>
            <CIcon name="cil-bell" /> Notifications
            <CBadge
                color="info"
                class="ml-auto"
            >
                {{ itemsCount }}
            </CBadge>
        </CDropdownItem>
        <CDropdownItem>
            <CIcon name="cil-task" /> Tasks
            <CBadge
                color="danger"
                class="ml-auto"
            >
                {{ itemsCount }}
            </CBadge>
        </CDropdownItem>
        <CDropdownHeader
            tag="div"
            class="text-center"
            color="light"
        >
            <strong>Settings</strong>
        </CDropdownHeader>
        <CDropdownItem>
            <CIcon name="cil-user" /> Profile
        </CDropdownItem>
        <CDropdownItem>
            <CIcon name="cil-settings" /> Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem>
            <CIcon name="cil-lock-locked" /> Logout
        </CDropdownItem>
    </CDropdown>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component({
  name: 'TheHeaderDropdownAccnt'
})
export default class TheHeaderDropdownAccnt extends Vue {
  itemsCount = 42;
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>
