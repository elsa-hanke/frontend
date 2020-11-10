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
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :epa-osaamisalueet="epaOsaamisalueet"
            :kouluttajat="kouluttajat"
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
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { confimExit } from "@/utils/confirm";
import { ArviointipyyntoLomake } from "@/types";
import { toastFail } from "@/utils/toast";
import ArviointipyyntoForm from "@/forms/arviointipyynto-form.vue";

Component.registerHooks(["beforeRouteLeave"]);

@Component({
  components: {
    ArviointipyyntoForm
  }
})
export default class Arviointipyynto extends Vue {
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
  saved = false;
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
      console.log(this.arviointipyynto, value);
      // arviointipyynnon-muokkaaminen-epaonnistui
      try {
        const arviointipyynto = (
          await axios.put(
            "erikoistuva-laakari/suoritusarvioinnit/arviointipyynto",
            {
              id: this.arviointipyynto.id,
              tyoskentelyjaksoId: value.arvioinninAntajaId,
              arvioitavaOsaalueId: value.arvioitavaOsaalueId,
              arvioitavaTapahtuma: value.tapahtumanAjankohta,
              arvioinninAntajaId: value.arvioinninAntajaId,
              tapahtumanAjankohta: value.tapahtumanAjankohta,
              lisatiedot: value.lisatiedot
            }
          )
        ).data;
        this.saved = true;
        this.$router.push({
          name: "arviointipyynto-lahetetty",
          params: { arviointiId: `${arviointipyynto.id}` }
        });
      } catch (err) {
        toastFail(this, this.$t("arviointipyynnon-muokkaaminen-epaonnistui"));
      }
    } else {
      try {
        const arviointipyynto = (
          await axios.post(
            "erikoistuva-laakari/suoritusarvioinnit/arviointipyynto",
            value
          )
        ).data;
        this.saved = true;
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
}
</script>

<style lang="scss" scoped>
.arviointipyynto {
  max-width: 970px;
}
</style>
