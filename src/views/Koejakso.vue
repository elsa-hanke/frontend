<template>
  <div class="koejakso">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("koejakso") }}</h1>
          <p>{{ $t("koejakso-kuvaus") }}</p>
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
