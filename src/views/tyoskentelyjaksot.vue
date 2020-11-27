<template>
  <div class="tyoskentelyjaksot">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("tyoskentelyjaksot") }}</h1>
          <p>{{ $t("tyoskentelyjaksot-kuvaus") }}</p>
          <elsa-button
            variant="primary"
            :to="{ name: 'uusi-tyoskentelyjakso' }"
            class="mb-4 mr-2"
            >{{ $t("lisaa-tyoskentelyjakso") }}</elsa-button
          >
          <elsa-button
            variant="outline-primary"
            :to="{ name: 'uusi-poissaolo' }"
            class="mb-4"
            >{{ $t("lisaa-poissaolo") }}</elsa-button
          >
          <div
            class="d-flex justify-content-center border rounded py-5 mb-4 text-danger"
          >
            TODO: Työskentelypaikka erikoisalalla
          </div>
          <div class="mb-4 text-danger">
            TODO: Työskentelyjaksojen taulukko
          </div>
          <p class="text-size-sm">
            {{ $t("tyoskentelyjaksot-taulukko-kuvaus") }}
          </p>
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
export default class Tyoskentelyjaksot extends Vue {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("tyoskentelyjaksot"),
      active: true
    }
  ];
}
</script>

<style lang="scss" scoped>
.tyoskentelyjaksot {
  max-width: 1024px;
}
.tilastot {
  padding: 200px;
}
</style>
