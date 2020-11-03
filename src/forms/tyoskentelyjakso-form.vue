<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('kunta')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.tyoskentelypaikka.kunta"
          :required="true"
        ></b-form-input>
        <!--
        <elsa-multiselect
          :id="uid"
          v-model="value.tyoskentelypaikka.kunta"
          :options="kunnat"
          :loading="kunnatLoading"
          :required="true"
          @select="onKuntaSelect"
          @remove="onKuntaRemove"
        >
        </elsa-multiselect>
        -->
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyoskentelypaikka')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.tyoskentelypaikka.nimi"
          :required="true"
        ></b-form-input>
        <!--
        <elsa-multiselect
          :id="uid"
          v-model="value.tyoskentelypaikka"
          :options="tyoskentelypaikat"
          :loading="organisaatiotLoading"
          :required="true"
          :disabled="!value.tyoskentelypaikka.kunta"
          label="abbreviation"
          track-by="organizationId"
        >
        </elsa-multiselect>
        -->
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyyppi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-radio-group
          :id="uid"
          v-model="value.tyoskentelypaikka.tyyppi"
          :options="tyypit"
          :required="true"
          name="tyoskentelyjakso-tyyppi"
          stacked
        ></b-form-radio-group>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        :required="true"
        class="col-sm-12 col-md-6 pr-md-3"
      >
        <template v-slot="{ uid }">
          <b-form-datepicker
            :id="uid"
            v-model="value.alkamispaiva"
            :required="true"
            :max="value.paattymispaiva"
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
          >
            <template v-slot:button-content
              ><font-awesome-icon
                :icon="['far', 'calendar-alt']"
                class="text-primary"
            /></template>
          </b-form-datepicker>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('paattymispaiva')"
        class="col-sm-12 col-md-6 pl-md-3"
      >
        <template v-slot="{ uid }">
          <b-form-datepicker
            :id="uid"
            v-model="value.paattymispaiva"
            :min="value.alkamispaiva"
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
                class="text-primary"/></template
          ></b-form-datepicker>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group
      :label="$t('tyoaika-taydesta-tyopaivasta')"
      :required="true"
    >
      <template v-slot="{ uid }">
        <div class="d-flex align-items-center">
          <b-form-input
            :id="uid"
            v-model="value.osaaikaprosentti"
            type="number"
            min="50"
            max="100"
            :required="true"
          />
          <span class="mx-3">%</span>
        </div>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <b-button
        type="reset"
        variant="link"
        @click.stop.prevent="onCancelClick"
        class="text-decoration-none font-weight-500 mr-2"
        >{{ $t("peruuta") }}</b-button
      >
      <b-button type="submit" variant="primary">{{ $t("lisaa") }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaMultiselect from "@/components/multiselect/multiselect.vue";

@Component({
  components: {
    ElsaFormGroup,
    ElsaMultiselect
  }
})
export default class TyoskentelyjaksoForm extends Vue {
  value = {
    tunnus: "wip",
    alkamispaiva: null,
    paattymispaiva: null,
    osaaikaprosentti: 100,
    tyoskentelypaikka: {
      nimi: null,
      kunta: null,
      tyyppi: null
    }
  } as any;
  kunnat = [];
  tyoskentelypaikat = [];
  tyypit = [
    { text: this.$t("terveyskeskus"), value: "TERVEYSKESKUS" },
    { text: this.$t("keskussairaala"), value: "KESKUSSAIRAALA" },
    {
      text: this.$t("yliopistollinen-sairaala"),
      value: "YLIOPISTOLLINEN_SAIRAALA"
    },
    { text: this.$t("yksityinen"), value: "YKSITYINEN" }
  ];
  kunnatLoading = false;
  organisaatiotLoading = false;

  mounted() {
    this.fetchKunnat();
  }

  async fetchKunnat() {
    this.kunnatLoading = true;
    this.kunnat = (await axios.get("sote-organisaatiot/kunnat")).data;
    this.kunnatLoading = false;
  }

  async fetchOrganisaatiot(selected: string) {
    this.organisaatiotLoading = true;
    this.tyoskentelypaikat = (
      await axios.get("sote-organisaatiot", {
        params: {
          "postOffice.equals": selected
        }
      })
    ).data;
    this.organisaatiotLoading = false;
  }

  onKuntaSelect(selected: any) {
    this.fetchOrganisaatiot(selected);
  }

  onKuntaRemove() {
    this.tyoskentelypaikat = [];
    this.value.tyoskentelypaikka = {
      nimi: null,
      kunta: null,
      tyyppi: null
    };
  }

  onSubmit() {
    this.$emit("submit", this.value);
  }

  onCancelClick() {
    this.$emit("cancel");
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
