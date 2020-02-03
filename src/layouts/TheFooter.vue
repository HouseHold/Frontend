<template>
  <CFooter>
    <div>
      <a
        href="https://github.com/HouseHold/HouseHold"
        target="_blank"
      >HouseHold</a>
      <span class="ml-1">&copy; 2019-{{ this.year }} <a href="https://xn--gran-8qa.fi"> Niko Granö</a> </span>
    </div>
    <div class="ml-auto">
      <span class="mr-1">Report a</span>
      <a
        href="https://github.com/HouseHold/HouseHold"
        target="_blank"
      >bug</a>
    </div>
  </CFooter>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component({
  name: 'TheFooter'
})
export default class TheFooter extends Vue {
  year = 2019;

  created() {
    this.year = (new Date()).getFullYear();
  }
}
</script>
