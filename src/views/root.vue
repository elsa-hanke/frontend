<template>
  <div id="root" :class="{ 'gray-backdrop': hasGrayBackdrop }">
    <navbar />
    <b-container fluid>
      <b-row>
        <sidebar-menu />
        <main role="main" class="offset-lg-2 col-lg-10">
          <router-view />
        </main>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Navbar from "@/components/navbar/navbar.vue";
import SidebarMenu from "@/components/sidebar-menu/sidebar-menu.vue";

@Component({
  components: {
    Navbar,
    SidebarMenu
  }
})
export default class Root extends Vue {
  get hasGrayBackdrop() {
    return this.$route.meta.grayBackdrop;
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";

.gray-backdrop {
  min-height: 100vh;
  background-color: $backdrop-background-color;
}
</style>
