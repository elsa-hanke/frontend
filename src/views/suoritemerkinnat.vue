<template>
  <div class="suoritemerkinnat">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("suoritemerkinnat") }}</h1>
          <p>{{ $t("suoritemerkinnat-kuvaus") }}</p>
          <b-button
            variant="primary"
            :to="{ name: 'uusi-suoritemerkinta' }"
            class="mb-4"
            >{{ $t("lisaa-suoritemerkinta") }}</b-button
          >
          <h2>{{ $t("oppimistavoitteet") }}</h2>
          TODO
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Suoritemerkinnat extends Vue {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("suoritemerkinnat"),
      active: true
    }
  ];
}
</script>

<style lang="scss" scoped>
.suoritemerkinnat {
  max-width: 1024px;
}
</style>
