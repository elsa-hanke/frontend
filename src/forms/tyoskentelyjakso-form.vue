<template>
  <b-form @submit="onSubmit">
    <elsa-form-group :label="$t('kunta')" :required="true">
      <template v-slot="{ uid }">
        <multiselect
          :id="uid"
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
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyoskentelypaikka')" :required="true">
      <template v-slot="{ uid }">
        <multiselect
          :id="uid"
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
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyyppi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-radio-group
          :id="uid"
          v-model="form.tyyppi"
          :options="tyypit"
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
            v-model="form.prosenttiosuus"
            type="number"
            min="50"
            max="100"
          />
          <span class="mx-3">%</span>
        </div>
      </template>
    </elsa-form-group>
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
