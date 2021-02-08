<template>
  <div class="koejakso">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("koejakso") }}</h1>
          <p>{{ $t("koejakso-kuvaus") }}</p>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <elsa-form-group :label="$t('tyoskentelyaika-erikoisalalla')">
                <h2>{{ $t("koejakson-suorituspaikka") }}</h2>
                <p>{{ $t("koejakson-suorituspaikka-kuvaus") }}</p>
              </elsa-form-group>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <elsa-form-group :label="$t('tyoskentelyaika-erikoisalalla')">
                <h2>{{ $t("koulutussopimus") }}</h2>
                <p>{{ $t("koulutussopimus-kuvaus") }}</p>
              </elsa-form-group>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import ElsaButton from "@/components/button/button.vue";
import ElsaPopover from "@/components/popover/popover.vue";
import ElsaLuottamuksenTaso from "@/components/luottamuksen-taso/luottamuksen-taso.vue";

@Component({
  components: {
    ElsaButton,
    ElsaPopover,
    ElsaLuottamuksenTaso
  }
})
export default class Koejakso extends Vue {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("koejakso"),
      active: true
    }
  ];

  async mounted() {
    const oppimistavoitteet = (
      await axios.get("erikoistuva-laakari/oppimistavoitteet-taulukko")
    ).data;
    console.log(oppimistavoitteet.toString());
  }
}
</script>

<style scoped></style>
