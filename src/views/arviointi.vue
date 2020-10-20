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
            <arviointi-form
              :value="value"
              @submit="onSubmit"
              :editing="false"
              v-if="value"
            />
            <div class="text-center" v-else>
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
          </b-card-skeleton>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import BCardSkeleton from "@/components/card/card.vue";
import ArviointiForm from "@/forms/arviointi-form.vue";

@Component({
  components: {
    BCardSkeleton,
    ArviointiForm
  }
})
export default class Arviointi extends Vue {
  value = null;
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

  async mounted() {
    if (this.$route && this.$route.params && this.$route.params.arviointiId) {
      this.value = (
        await axios.get(`suoritusarvioinnit/${this.$route.params.arviointiId}`)
      ).data;
    }
  }

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
