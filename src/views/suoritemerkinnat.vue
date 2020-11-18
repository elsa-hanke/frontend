<template>
  <div class="suoritemerkinnat">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("suoritemerkinnat") }}</h1>
          <p>{{ $t("suoritemerkinnat-kuvaus") }}</p>
          <elsa-button
            variant="primary"
            :to="{ name: 'uusi-suoritemerkinta' }"
            class="mb-4"
            >{{ $t("lisaa-suoritemerkinta") }}</elsa-button
          >
          <h2>{{ $t("oppimistavoitteet") }}</h2>
          <b-table
            v-if="osaamistavoitteet"
            striped
            hover
            :items="osaamistavoitteet"
          ></b-table>
          <b-spinner v-else />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ElsaButton from "@/components/button/button.vue";

@Component({
  components: {
    ElsaButton
  }
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
  osaamistavoitteet: any = null;

  mounted() {
    this.osaamistavoitteet = [];
  }
}
</script>

<style lang="scss" scoped>
.suoritemerkinnat {
  max-width: 1024px;
}
</style>
