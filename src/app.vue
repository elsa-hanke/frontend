<template>
  <div id="app">
    <navbar />
    <b-container fluid>
      <b-row>
        <sidebar-menu />
        <main role="main" class="offset-lg-2 col-lg-10">
          <!--<transition name="fade" mode="out-in">-->
          <router-view />
          <!--</transition>-->
        </main>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Navbar from "@/components/navbar/navbar.vue";
import SidebarbarMenu from "@/components/sidebar-menu/sidebar-menu.vue";
import { Meta } from "@/utils/decorators";

@Component({
  components: {
    navbar: Navbar,
    "sidebar-menu": SidebarbarMenu
  }
})
export default class App extends Vue {
  @Meta
  getMetaInfo() {
    if (this.$route && this.$route.name) {
      return {
        title: this.$t(this.$route.name),
        titleTemplate: `%s - ${this.$t("elsa-palvelu")}`
      };
    } else {
      return {
        title: this.$t("elsa-palvelu"),
        titleTemplate: null
      };
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
