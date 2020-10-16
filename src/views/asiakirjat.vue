<template>
  <div class="asiakirjat">
    <b-container fluid>
      <b-row class="mt-3" lg>
        <b-col class="px-0">
          <b-card-skeleton
            :header="$t('asiakirjat')"
            :loading="false"
            class="mb-3"
          >
            <b-table striped borderless hover :items="items"></b-table>
          </b-card-skeleton>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BCardSkeleton from "@/components/card/card.vue";

@Component({
  components: {
    BCardSkeleton
  }
})
export default class Asiakirjat extends Vue {
  items = [
    {
      aihe: "Sopimus",
      kuvaus: "Koejaksosopimus terveyskeskukseen",
      pvm: "pp.kk.vvvv",
      liite: "Sopimus.pdf",
      tilanne: "Hyväksytty"
    },
    {
      aihe: "Arviointi",
      kuvaus: "Osaamisperustaisuusarviointi",
      pvm: "pp.kk.vvvv",
      liite: "arviointi.pdf",
      tilanne: "Odottaa"
    },
    {
      aihe: "Teoriakoulutus",
      kuvaus: "Radiologia 101",
      pvm: "pp.kk.vvvv",
      liite: "teoriakoulutus.pdf",
      tilanne: "Odottaa"
    },
    {
      aihe: "Työssäolotodistus",
      kuvaus: "Radiologi",
      pvm: "pp.kk.vvvv",
      liite: "todistus.pdf",
      tilanne: "Odottaa"
    }
  ];
}
</script>
