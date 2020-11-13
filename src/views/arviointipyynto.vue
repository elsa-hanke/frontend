<template>
  <div class="arviointipyynto">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("pyyda-arviointia") }}</h1>
          <hr />
          <arviointipyynto-form
            v-if="!loading"
            :value="arviointipyyntoWrapper"
            @submit="onSubmit"
            @delete="onDelete"
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :epa-osaamisalueet="epaOsaamisalueet"
            :kouluttajat="kouluttajat"
            :editing="editing"
          />
          <div class="text-center" v-else>
            <b-spinner variant="primary" :label="$t('ladataan')"></b-spinner>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import axios from "axios";
import { confirmDelete } from "@/utils/confirm";
import { ArviointipyyntoLomake } from "@/types";
import { toastFail, toastSuccess } from "@/utils/toast";
import ArviointipyyntoForm from "@/forms/arviointipyynto-form.vue";
import ConfirmRouteExit from "@/mixins/confirm-route-exit";

@Component({
  components: {
    ArviointipyyntoForm
  }
})
export default class Arviointipyynto extends Mixins(ConfirmRouteExit) {
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
      text: this.$t("pyyda-arviointia"),
      active: true
    }
  ];
  arviointipyyntoLomake: null | ArviointipyyntoLomake = null;
  arviointipyynto: any = null;
  loading = true;

  async mounted() {
    await Promise.all([this.fetchLomake(), this.fetchArviointipyynto()]);
    this.loading = false;
  }

  async fetchLomake() {
    try {
      this.arviointipyyntoLomake = (
        await axios.get(`erikoistuva-laakari/arviointipyynto-lomake`)
      ).data;
    } catch (err) {
      toastFail(this, this.$t("arviointilomakkeen-hakeminen-epaonnistui"));
    }
  }

  async fetchArviointipyynto() {
    const arviointiId = this.$route?.params?.arviointiId;
    if (arviointiId) {
      try {
        this.arviointipyynto = (
          await axios.get(`suoritusarvioinnit/${arviointiId}`)
        ).data;
      } catch (err) {
        this.$router.replace({ name: "arvioinnit" });
      }
    }
  }

  async onSubmit(value: any) {
    if (this.arviointipyynto) {
      try {
        await axios.put("erikoistuva-laakari/suoritusarvioinnit", {
          id: this.arviointipyynto.id,
          tyoskentelyjaksoId: value.tyoskentelyjaksoId,
          arvioitavaOsaalueId: value.arvioitavaOsaalueId,
          arvioitavaTapahtuma: value.arvioitavaTapahtuma,
          arvioinninAntajaId: value.arvioinninAntajaId,
          tapahtumanAjankohta: value.tapahtumanAjankohta,
          lisatiedot: value.lisatiedot
        });
        toastSuccess(this, this.$t("arviointipyynnon-tallentaminen-onnistui"));
        this.skipRouteExitConfirm = true;
        this.$router.push({
          name: "arvioinnit"
        });
      } catch (err) {
        toastFail(this, this.$t("arviointipyynnon-tallentaminen-epaonnistui"));
      }
    } else {
      try {
        const arviointipyynto = (
          await axios.post(
            "erikoistuva-laakari/suoritusarvioinnit/arviointipyynto",
            value
          )
        ).data;
        this.skipRouteExitConfirm = true;
        this.$router.push({
          name: "arviointipyynto-lahetetty",
          params: { arviointiId: `${arviointipyynto.id}` }
        });
      } catch (err) {
        toastFail(
          this,
          this.$t("uuden-arviointipyynnon-lisaaminen-epaonnistui")
        );
      }
    }
  }

  async onDelete() {
    if (
      await confirmDelete(
        this,
        this.$t("poista-arviointipyynto") as string,
        (this.$t("arviointipyynnon") as string).toLowerCase()
      )
    ) {
      await axios.delete(
        `erikoistuva-laakari/suoritusarvioinnit/${this.arviointipyynto.id}`
      );
      toastSuccess(this, this.$t("arviointipyynto-poistettu-onnistuneesti"));
      this.skipRouteExitConfirm = true;
      this.$router.push({
        name: "arvioinnit"
      });
    }
  }

  get tyoskentelyjaksot() {
    if (this.arviointipyyntoLomake) {
      return this.arviointipyyntoLomake.tyoskentelyjaksot;
    } else {
      return [];
    }
  }

  get epaOsaamisalueet() {
    if (this.arviointipyyntoLomake) {
      return this.arviointipyyntoLomake.epaOsaamisalueet;
    } else {
      return [];
    }
  }

  get kouluttajat() {
    if (this.arviointipyyntoLomake) {
      return this.arviointipyyntoLomake.kouluttajat;
    } else {
      return [];
    }
  }

  get arviointipyyntoWrapper() {
    if (this.arviointipyynto) {
      return {
        ...this.arviointipyynto,
        epaOsaamisalue: this.arviointipyynto.arvioitavaOsaalue,
        kouluttaja: this.arviointipyynto.arvioinninAntaja
      };
    } else {
      return undefined;
    }
  }

  get editing() {
    return this.arviointipyyntoWrapper ? true : false;
  }
}
</script>

<style lang="scss" scoped>
.arviointipyynto {
  max-width: 970px;
}
</style>
