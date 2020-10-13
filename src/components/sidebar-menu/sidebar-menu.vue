<template>
  <nav
    id="sidebar-menu"
    class="col-lg-2 d-none d-lg-block d-xl-block bg-white sidebar"
  >
    <div class="sidebar-sticky font-weight-500">
      <b-nav vertical>
        <b-nav-item class="border-top border-bottom" :to="{ name: 'etusivu' }">
          <font-awesome-icon icon="home" fixed-width />
          {{ $t("etusivu") }}
        </b-nav-item>
        <!--
        <b-nav-item class="border-bottom" :to="{ name: 'koulutussuunnitelma' }">
          <font-awesome-icon icon="file" fixed-width />
          {{ $t("koulutussuunnitelma") }}
        </b-nav-item>
        -->
        <b-nav-item class="border-bottom" :to="{ name: 'arvioinnit' }">
          <font-awesome-icon icon="award" fixed-width />
          {{ $t("arvioinnit") }}
        </b-nav-item>
        <!--
        <b-nav-item class="border-bottom" :to="{ name: 'tyoskentelyjaksot' }">
          <font-awesome-icon icon="calendar" fixed-width />
          {{ $t("tyoskentelyjaksot") }}
        </b-nav-item>
        <b-nav-item class="border-bottom" :to="{ name: 'koulutukset' }">
          <font-awesome-icon icon="file-alt" fixed-width />
          {{ $t("koulutukset") }}
        </b-nav-item>
        <b-nav-item class="border-bottom" :to="{ name: 'viestit' }">
          <font-awesome-icon icon="envelope" fixed-width />
          {{ $t("viestit") }}
        </b-nav-item>
        <b-nav-item class="border-bottom" :to="{ name: 'asiakirjat' }">
          <font-awesome-icon icon="file" fixed-width />
          {{ $t("asiakirjat") }}
        </b-nav-item>
        -->
      </b-nav>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class SidebarMenu extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/_variables.scss";

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 64px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);

  .nav-link {
    padding: 1rem;
    &:hover {
      background-color: rgba($primary, 0.1);
    }
    &.router-link-active {
      background-color: $primary;
      color: white;
    }
  }

  .sidebar-sticky {
    position: sticky;
    top: 0;
    height: calc(100vh - 64px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
