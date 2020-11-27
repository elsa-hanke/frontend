<template>
  <div class="tyoskentelyjakso">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("tyoskentelyjakso") }}</h1>
          <hr />
          <div v-if="!loading" class="text-danger">TODO</div>
          <div class="text-center" v-else>
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
//import axios from "axios";
import { Component, Mixins } from "vue-property-decorator";
import ConfirmRouteExit from "@/mixins/confirm-route-exit";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
//import { toastFail, toastSuccess } from "@/utils/toast";

@Component({
  components: {
    TyoskentelyjaksoForm
  }
})
export default class Tyoskentelyjakso extends Mixins(ConfirmRouteExit) {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("tyoskentelyjaksot"),
      to: { name: "tyoskentelyjaksot" }
    },
    {
      text: this.$t("tyoskentelyjakso"),
      active: true
    }
  ];
  loading = true;

  async mounted() {
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>
.tyoskentelyjakso {
  max-width: 768px;
}
</style>
