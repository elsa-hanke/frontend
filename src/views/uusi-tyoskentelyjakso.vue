<template>
  <div class="lisaa-tyoskentelyjakso">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("lisaa-tyoskentelyjakso") }}</h1>
          <hr />
          <tyoskentelyjakso-form
            v-if="!loading"
            @submit="onSubmit"
            :modal="false"
          />
          <div class="text-center" v-else>
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Mixins } from "vue-property-decorator";
import ConfirmRouteExit from "@/mixins/confirm-route-exit";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import { toastFail, toastSuccess } from "@/utils/toast";

@Component({
  components: {
    TyoskentelyjaksoForm
  }
})
export default class UusiTyoskentelyjakso extends Mixins(ConfirmRouteExit) {
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
      text: this.$t("lisaa-tyoskentelyjakso"),
      active: true
    }
  ];
  loading = true;

  async mounted() {
    this.loading = false;
  }

  async onSubmit(value: any, params: any) {
    params.saving = true;
    try {
      const tyoskentelyjakso = (
        await axios.post("/erikoistuva-laakari/tyoskentelyjaksot", value)
      ).data;
      toastSuccess(this, this.$t("uusi-tyoskentelyjakso-lisatty"));
      this.skipRouteExitConfirm = true;
      this.$router.push({
        name: "tyoskentelyjakso",
        params: {
          tyoskentelyjaksoId: `${tyoskentelyjakso.id}`
        }
      });
    } catch (err) {
      toastFail(
        this,
        this.$t("uuden-tyoskentelyjakson-lisaaminen-epaonnistui")
      );
    }
    params.saving = false;
  }
}
</script>

<style lang="scss" scoped>
.lisaa-tyoskentelyjakso {
  max-width: 768px;
}
</style>
