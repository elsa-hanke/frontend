<template>
  <div class="itsearviointi">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="pl-0 pr-0">
          <b-card-skeleton
            :loading="false"
            class="mb-3 itsearviointi-card"
            :header="$t('tee-itsearviointi')"
          >
            <arviointi-form @submit="onSubmit" :editing="true" />
          </b-card-skeleton>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { confimExit } from "@/utils/confirm";
import BCardSkeleton from "@/components/card/card.vue";
import ArviointiForm from "@/forms/arviointi-form.vue";

@Component({
  components: {
    BCardSkeleton,
    ArviointiForm
  }
})
export default class Itsearviointi extends Vue {
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
      text: this.$t("tee-itsearviointi"),
      active: true
    }
  ];
  saved = false;

  onSubmit(form: any) {
    console.log(form);
    this.saved = true;
    this.$router.push({ name: "itsearviointi-valmis" });
  }

  async beforeRouteLeave(to: any, from: any, next: any) {
    try {
      if (this.saved || (await confimExit(this))) {
        next();
      } else {
        next(false);
      }
    } catch (err) {
      next(false);
    }
  }
}
</script>

<style lang="scss" scoped>
.itsearviointi-card {
  max-width: 970px;
}
</style>
