<template>
  <b-form @submit="onSubmit">
    <elsa-form-group
      :label-for="tyoskentelyjaksoKuntaId"
      :label="$t('kunta')"
      :required="true"
    >
      <multiselect
        :id="tyoskentelyjaksoKuntaId"
        v-model="form.kunta"
        :options="kunnat"
        :placeholder="$t('valitse')"
        label="name"
        track-by="name"
      >
        <template slot="noResult">
          <div>{{ $t("ei-hakutuloksia") }}</div>
        </template>
        <template slot="noOptions">{{ $t("ei-vaihtoehtoja") }}</template>
      </multiselect>
    </elsa-form-group>
    <elsa-form-group
      :label-for="tyoskentelyjaksoTyoskentelypaikkaId"
      :label="$t('tyoskentelypaikka')"
      :required="true"
    >
      <multiselect
        :id="tyoskentelyjaksoTyoskentelypaikkaId"
        v-model="form.tyoskentelypaikka"
        :options="tyoskentelypaikat"
        :placeholder="$t('valitse')"
        label="name"
        track-by="name"
      >
        <template slot="noResult">
          <div>{{ $t("ei-hakutuloksia") }}</div>
        </template>
        <template slot="noOptions">{{ $t("ei-vaihtoehtoja") }}</template>
      </multiselect>
    </elsa-form-group>
    <elsa-form-group
      :label-for="tyoskentelyjaksoTyyppiId"
      :label="$t('tyyppi')"
      :required="true"
      ><b-form-radio-group
        :id="tyoskentelyjaksoTyyppiId"
        v-model="form.tyyppi"
        :options="tyypit"
        name="tyoskentelyjakso-tyyppi"
        stacked
      ></b-form-radio-group
    ></elsa-form-group>
    <b-form-row>
      <b-form-group
        :label-for="tyoskentelyjaksoAlkamispaivaId"
        class="col-sm-12 col-md-6 pr-md-3"
        ><template v-slot:label
          ><div class="text-nowrap">
            {{ $t("alkamispaiva") }} <span class="text-primary">*</span>
          </div></template
        ><b-form-datepicker
          :id="tyoskentelyjaksoAlkamispaivaId"
          v-model="form.alkamispaiva"
          :max="form.paattymispaiva"
          start-weekday="1"
          :locale="currentLocale"
          placeholder=""
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          }"
          :label-help="$t('datepicker-label-help')"
          :label-no-date-selected="$t('datepicker-no-date-selected')"
          ><template v-slot:button-content
            ><font-awesome-icon
              :icon="['far', 'calendar-alt']"
              class="text-primary"/></template></b-form-datepicker
      ></b-form-group>
      <b-form-group
        :label-for="tyoskentelyjaksoPaattymispaivaId"
        class="col-sm-12 col-md-6 pl-md-3"
        ><template v-slot:label
          ><div class="text-nowrap">
            {{ $t("paattymispaiva") }} <span class="text-primary">*</span>
          </div></template
        ><b-form-datepicker
          :id="tyoskentelyjaksoPaattymispaivaId"
          v-model="form.paattymispaiva"
          :min="form.alkamispaiva"
          start-weekday="1"
          :locale="currentLocale"
          placeholder=""
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          }"
          :label-help="$t('datepicker-label-help')"
          :label-no-date-selected="$t('datepicker-no-date-selected')"
          class="datepicker-range"
          ><template v-slot:button-content
            ><font-awesome-icon
              :icon="['far', 'calendar-alt']"
              class="text-primary"/></template></b-form-datepicker
      ></b-form-group>
    </b-form-row>
    <elsa-form-group
      :label-for="tyoskentelyjaksoProsenttiosuusId"
      :label="$t('tyoaika-taydesta-tyopaivasta')"
      :required="true"
      ><div class="d-flex align-items-center">
        <b-form-input
          :id="tyoskentelyjaksoProsenttiosuusId"
          v-model="form.prosenttiosuus"
          type="number"
          min="50"
          max="100"
        />
        <span class="mx-3">%</span>
      </div></elsa-form-group
    >
  </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Multiselect from "vue-multiselect";
import ElsaFormGroup from "@/components/form-group/form-group.vue";

@Component({
  components: {
    ElsaFormGroup,
    Multiselect
  }
})
export default class TyoskentelyjaksoForm extends Vue {
  form = {
    kunta: null,
    tyoskentelypaikka: null,
    tyyppi: null,
    alkamispaiva: null,
    paattymispaiva: null,
    prosenttiosuus: 100
  };
  kunnat = [];
  tyoskentelypaikat = [];
  tyypit = [
    { text: this.$t("terveyskeskus"), value: "t" },
    { text: this.$t("keskussairaala"), value: "k" },
    { text: this.$t("yliopistollinen-sairaala"), value: "ys" },
    { text: this.$t("yksityinen"), value: "y" }
  ];

  onSubmit(event: any) {
    event.preventDefault();
    console.log("onSubmit", this.form);
  }

  get uid() {
    return (this as any)._uid;
  }

  get tyoskentelyjaksoKuntaId() {
    return `tyoskentelyjakso-kunta-${this.uid}`;
  }

  get tyoskentelyjaksoTyoskentelypaikkaId() {
    return `tyoskentelyjakso-tyoskentelypaikka-${this.uid}`;
  }

  get tyoskentelyjaksoTyyppiId() {
    return `tyoskentelyjakso-tyyppi-${this.uid}`;
  }

  get tyoskentelyjaksoAlkamispaivaId() {
    return `tyoskentelyjakso-alkamispaiva-${this.uid}`;
  }

  get tyoskentelyjaksoPaattymispaivaId() {
    return `tyoskentelyjakso-paattymispaiva-${this.uid}`;
  }

  get tyoskentelyjaksoProsenttiosuusId() {
    return `tyoskentelyjakso-prosenttiosuus-${this.uid}`;
  }

  get currentLocale() {
    return this.$i18n.locale;
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";
@import "~bootstrap/scss/mixins/breakpoints";

.datepicker-range::before {
  content: "–";
  position: absolute;
  left: -2rem;
  padding: 0.375rem 0.75rem;
  @include media-breakpoint-down(sm) {
    display: none;
  }
}
</style>
