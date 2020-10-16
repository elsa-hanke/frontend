<template>
  <div class="arviointi">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <b-card-skeleton
            :loading="false"
            class="mb-3 arviointi-card"
            :header="$t('arviointi')"
          >
            <arviointi-form @submit="onSubmit" :editing="false" />
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
import ArviointiForm from "@/forms/arviointi-form.vue";

@Component({
  components: {
    BCardSkeleton,
    ArviointiForm
  }
})
export default class Arviointi extends Vue {
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
      text: this.$t("arviointi"),
      active: true
    }
  ];

  onSubmit(form: any) {
    console.log(form);
  }
}
</script>

<style lang="scss" scoped>
.arviointi-card {
  max-width: 970px;
}
</style>
