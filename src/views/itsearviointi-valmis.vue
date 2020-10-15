<template>
  <div class="itsearviointi-valmis">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="pl-0 pr-0">
          <b-card-skeleton
            :loading="false"
            class="mb-3 arviointipyynto-card"
            :header="$t('itsearviointi-valmis')"
          >
            <p class="text-center">
              Lorem ipsum dolor sit amet...
            </p>
            <div class="d-flex justify-content-center">
              <b-button
                type="submit"
                variant="primary"
                class="mr-3"
                :to="{ name: 'arvioinnit' }"
                >{{ $t("palaa-arviointeihin") }}</b-button
              >
            </div>
          </b-card-skeleton>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BCardSkeleton from "@/components/card/card.vue";

Component.registerHooks(["beforeRouteLeave"]);

@Component({
  components: {
    BCardSkeleton
  }
})
export default class ItsearviointiValmis extends Vue {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("arvioinnit"),
      to: { name: "arvioinnit" }
    },
    {
      text: this.$t("itsearviointi-valmis"),
      active: true
    }
  ];
}
</script>

<style lang="scss" scoped>
.arviointipyynto-card {
  max-width: 970px;
}
</style>
