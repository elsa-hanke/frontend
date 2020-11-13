<template>
  <div class="lisaa-suoritemerkinta">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("pyyda-arviointia") }}</h1>
          <hr />
          <suoritemerkinta-form v-if="suoritemerkintaLomake" />
          <div class="text-center" v-else>
            <b-spinner variant="primary" :label="$t('ladataan')"></b-spinner>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ConfirmRouteExit from "@/mixins/confirm-route-exit";
import SuoritemerkintaForm from "@/forms/suoritemerkinta-form.vue";

@Component({
  components: {
    SuoritemerkintaForm
  }
})
export default class UusiSuoritemerkinta extends Mixins(ConfirmRouteExit) {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("suoritemerkinnat"),
      to: { name: "suoritemerkinnat" }
    },
    {
      text: this.$t("lisaa-suoritemerkinta"),
      active: true
    }
  ];
  suoritemerkintaLomake = {};
}
</script>

<style lang="scss" scoped>
.lisaa-suoritemerkinta {
  max-width: 970px;
}
</style>
