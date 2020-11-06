<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('kunta')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.tyoskentelypaikka.kunta"
          :state="validateState('tyoskentelypaikka.kunta')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
        <!--
        <elsa-multiselect
          :id="uid"
          v-model="value.tyoskentelypaikka.kunta"
          :options="kunnat"
          :loading="kunnatLoading"
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
          :state="validateState('tyoskentelypaikka.nimi')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
        <!--
        <elsa-multiselect
          :id="uid"
          v-model="value.tyoskentelypaikka"
          :options="tyoskentelypaikat"
          :loading="organisaatiotLoading"
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
          :state="validateState('tyoskentelypaikka.tyyppi')"
          :options="tyypit"
          name="tyoskentelyjakso-tyyppi"
          stacked
        ></b-form-radio-group>
        <b-form-invalid-feedback
          :id="`${uid}-feedback`"
          :style="{
            display:
              validateState('tyoskentelypaikka.tyyppi') === false
                ? 'block'
                : 'none'
          }"
          >{{ $t("pakollinen-tieto") }}</b-form-invalid-feedback
        >
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-sm-12 col-md-6 pr-md-3"
        :required="true"
      >
        <template v-slot="{ uid }">
          <b-form-datepicker
            :id="uid"
            v-model="value.alkamispaiva"
            :state="validateState('alkamispaiva')"
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
          <b-form-invalid-feedback :id="`${uid}-feedback`">{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
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
            :state="validateState('osaaikaprosentti')"
            type="number"
            :step="1"
          />
          <span class="mx-3">%</span>
        </div>
        <b-form-invalid-feedback
          :id="`${uid}-feedback`"
          :style="{
            display:
              validateState('osaaikaprosentti') === false ? 'block' : 'none'
          }"
          >{{ $t("osaaikaprosentti-validointivirhe") }}</b-form-invalid-feedback
        >
      </template>
    </elsa-form-group>
    <div class="text-right">
      <b-button
        type="reset"
        variant="back"
        @click.stop.prevent="onCancelClick"
        class="mr-2"
        >{{ $t("peruuta") }}</b-button
      >
      <b-button type="submit" variant="primary">{{ $t("lisaa") }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import axios from "axios";
import { Mixins } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required, between } from "vuelidate/lib/validators";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaMultiselect from "@/components/multiselect/multiselect.vue";

@Component({
  components: {
    ElsaFormGroup,
    ElsaMultiselect
  },
  validations: {
    value: {
      tyoskentelypaikka: {
        required,
        nimi: {
          required
        },
        kunta: {
          required
        },
        tyyppi: {
          required
        }
      },
      alkamispaiva: {
        required
      },
      osaaikaprosentti: {
        required,
        between: between(50, 100)
      }
    }
  }
})
export default class TyoskentelyjaksoForm extends Mixins(validationMixin) {
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

  validateState(name: string) {
    // TODO: Vaatii refaktorointia
    const get = (obj: any, path: any, defaultValue = undefined) => {
      const travel = (regexp: any) =>
        String.prototype.split
          .call(path, regexp)
          .filter(Boolean)
          .reduce(
            (res, key) => (res !== null && res !== undefined ? res[key] : res),
            obj
          );
      const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
      return result === undefined || result === obj ? defaultValue : result;
    };

    const { $dirty, $error } = get(this.$v.value, name);
    return $dirty ? ($error ? false : null) : null;
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
    this.$v.value.$touch();
    if (this.$v.value.$anyError) {
      return;
    }
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
