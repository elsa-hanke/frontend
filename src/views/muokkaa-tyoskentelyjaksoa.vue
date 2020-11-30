<template>
  <div class="muokkaa-tyoskentelyjaksoa">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("muokkaa-tyoskentelyjaksoa") }}</h1>
          <hr />
          <tyoskentelyjakso-form
            v-if="tyoskentelyjakso"
            @submit="onSubmit"
            @delete="onDelete"
            @cancel="onCancel"
            :value="tyoskentelyjakso"
            :editing="true"
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
import { confirmDelete } from "@/utils/confirm";

@Component({
  components: {
    TyoskentelyjaksoForm
  }
})
export default class MuokkaaTyoskentelyjaksoa extends Mixins(ConfirmRouteExit) {
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
      text: this.$t("muokkaa-tyoskentelyjaksoa"),
      active: true
    }
  ];
  tyoskentelyjakso: any = null;

  async mounted() {
    await this.fetchTyoskentelyjakso();
  }

  async fetchTyoskentelyjakso() {
    const tyoskentelyjaksoId = this.$route?.params?.tyoskentelyjaksoId;
    if (tyoskentelyjaksoId) {
      try {
        this.tyoskentelyjakso = (
          await axios.get(
            `erikoistuva-laakari/tyoskentelyjaksot/${tyoskentelyjaksoId}`
          )
        ).data;
      } catch (err) {
        this.$router.replace({ name: "tyoskentelyjaksot" });
      }
    }
  }

  async onSubmit(value: any, params: any) {
    params.saving = true;
    try {
      this.tyoskentelyjakso = (
        await axios.put("erikoistuva-laakari/tyoskentelyjaksot", value)
      ).data;
      toastSuccess(this, this.$t("tyoskentelyjakson-tallentaminen-onnistui"));
      this.skipRouteExitConfirm = true;
      this.$router.push({
        name: "tyoskentelyjakso",
        params: {
          tyoskentelyjaksoId: `${this.tyoskentelyjakso.id}`
        }
      });
    } catch (err) {
      toastFail(this, this.$t("tyoskentelyjakson-tallentaminen-epaonnistui"));
    }
    params.saving = false;
  }

  async onDelete(params: any) {
    if (
      await confirmDelete(
        this,
        this.$t("poista-tyoskentelyjakso") as string,
        (this.$t("tyoskentelyjakson") as string).toLowerCase()
      )
    ) {
      params.deleting = true;
      try {
        await axios.delete(
          `erikoistuva-laakari/tyoskentelyjaksot/${this.tyoskentelyjakso.id}`
        );
        toastSuccess(this, this.$t("tyoskentelyjakso-poistettu-onnistuneesti"));
        this.skipRouteExitConfirm = true;
        this.$router.push({
          name: "tyoskentelyjaksot"
        });
      } catch (err) {
        toastFail(this, this.$t("tyoskentelyjakson-poistaminen-epaonnistui"));
      }
      params.deleting = false;
    }
  }

  onCancel() {
    this.$router.push({
      name: "tyoskentelyjaksot"
    });
  }
}
</script>

<style lang="scss" scoped>
.muokkaa-tyoskentelyjaksoa {
  max-width: 768px;
}
</style>
