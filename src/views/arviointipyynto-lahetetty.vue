<template>
  <div class="arviointipyynto-lahetetty">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="pl-0 pr-0">
          <b-card-skeleton
            :loading="false"
            class="mb-3 arviointipyynto-card"
            :header="$t('arviointipyynto-lahetetty')"
          >
            <p class="text-center">
              {{ $t("arviointipyynto-lahetetty-ilmoitus") }}
            </p>
            <p class="text-center">
              {{ $t("arviointipyynto-lahetetty-itsearviointi-muistutus") }}
            </p>
            <div class="d-flex justify-content-center">
              <b-button
                type="submit"
                variant="primary"
                class="mr-3"
                :to="{ name: 'arvioinnit' }"
                >{{ $t("palaa-arviointeihin") }}</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                :to="{ name: 'itsearviointi' }"
                >{{ $t("tee-tapahtumasta-itsearviointi") }}</b-button
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
export default class ArviointipyyntoLahetetty extends Vue {
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
      text: this.$t("arviointipyynto-lahetetty"),
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
