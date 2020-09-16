<template>
  <div id="root">
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

@Component({
  components: {
    navbar: Navbar,
    "sidebar-menu": SidebarbarMenu
  }
})
export default class Root extends Vue {}
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
