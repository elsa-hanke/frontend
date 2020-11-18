<template>
  <div class="muokkaa-suoritemerkintaa">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("muokkaa-suoritemerkintaa") }}</h1>
          <hr />
          <suoritemerkinta-form
            v-if="!loading"
            @submit="onSubmit"
            :value="suoritemerkintaWrapper"
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :oppimistavoitteen-kategoriat="oppimistavoitteenKategoriat"
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
import SuoritemerkintaForm from "@/forms/suoritemerkinta-form.vue";
import { SuoritemerkintaLomake } from "@/types";
import { toastFail, toastSuccess } from "@/utils/toast";
import { tyoskentelyjaksoLabel } from "@/utils/tyoskentelyjakso";

@Component({
  components: {
    SuoritemerkintaForm
  }
})
export default class MuokkaaSuoritemerkintaa extends Mixins(ConfirmRouteExit) {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("suoritemerkinnat"),
      to: { name: "suoritemerkinnat" }
    },
    {
      text: this.$t("muokkaa-suoritemerkintaa"),
      active: true
    }
  ];
  suoritemerkintaLomake: null | SuoritemerkintaLomake = null;
  suoritemerkinta: any = null;
  loading = true;

  async mounted() {
    await Promise.all([this.fetchLomake(), this.fetchSuoritemerkinta()]);
    this.loading = false;
  }

  async fetchSuoritemerkinta() {
    const suoritemerkintaId = this.$route?.params?.suoritemerkintaId;
    if (suoritemerkintaId) {
      try {
        this.suoritemerkinta = (
          await axios.get(
            `erikoistuva-laakari/suoritemerkinnat/${suoritemerkintaId}`
          )
        ).data;
      } catch (err) {
        this.$router.replace({ name: "suoritemerkinnat" });
      }
    }
  }

  async fetchLomake() {
    try {
      this.suoritemerkintaLomake = (
        await axios.get(`erikoistuva-laakari/suoritemerkinta-lomake`)
      ).data;
    } catch (err) {
      toastFail(
        this,
        this.$t("suoritemerkinnan-lomakkeen-hakeminen-epaonnistui")
      );
    }
  }

  async onSubmit(value: any, params: any) {
    params.saving = true;
    try {
      this.suoritemerkinta = (
        await axios.put("erikoistuva-laakari/suoritemerkinnat", {
          id: this.suoritemerkinta.id,
          tyoskentelyjaksoId: value.tyoskentelyjaksoId,
          oppimistavoiteId: value.oppimistavoiteId,
          vaativuustaso: value.vaativuustaso,
          luottamuksenTaso: value.luottamuksenTaso,
          suorituspaiva: value.suorituspaiva,
          lisatiedot: value.lisatiedot
        })
      ).data;
      toastSuccess(this, this.$t("suoritemerkinnan-tallentaminen-onnistui"));
      this.skipRouteExitConfirm = true;
      this.$router.push({
        name: "suoritemerkinta",
        params: {
          suoritemerkintaId: `${this.suoritemerkinta.id}`
        }
      });
    } catch (err) {
      toastFail(this, this.$t("suoritemerkinnan-tallentaminen-epaonnistui"));
    }
    params.saving = false;
  }

  get tyoskentelyjaksot() {
    if (this.suoritemerkintaLomake) {
      return this.suoritemerkintaLomake.tyoskentelyjaksot;
    } else {
      return [];
    }
  }

  get oppimistavoitteenKategoriat() {
    if (this.suoritemerkintaLomake) {
      return this.suoritemerkintaLomake.oppimistavoitteenKategoriat;
    } else {
      return [];
    }
  }

  get suoritemerkintaWrapper() {
    if (this.suoritemerkinta) {
      return {
        ...this.suoritemerkinta,
        tyoskentelyjakso: {
          ...this.suoritemerkinta.tyoskentelyjakso,
          label: tyoskentelyjaksoLabel(
            this,
            this.suoritemerkinta.tyoskentelyjakso
          )
        }
      };
    } else {
      return undefined;
    }
  }
}
</script>

<style lang="scss" scoped>
.muokkaa-suoritemerkintaa {
  max-width: 970px;
}
</style>
