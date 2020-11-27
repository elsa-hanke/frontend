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
        <elsa-form-multiselect
          :id="uid"
          v-model="value.tyoskentelypaikka.kunta"
          :options="kunnat"
          :loading="kunnatLoading"
          @select="onKuntaSelect"
          @remove="onKuntaRemove"
        >
        </elsa-form-multiselect>
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
        <elsa-form-multiselect
          :id="uid"
          v-model="value.tyoskentelypaikka"
          :options="tyoskentelypaikat"
          :loading="organisaatiotLoading"
          :disabled="!value.tyoskentelypaikka.kunta"
          label="abbreviation"
          track-by="organizationId"
        >
        </elsa-form-multiselect>
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
        <b-form-radio
          v-model="value.tyoskentelypaikka.tyyppi"
          :state="validateState('tyoskentelypaikka.tyyppi')"
          name="tyoskentelyjakso-tyyppi"
          value="MUU"
          >{{ $t("muu")
          }}<span v-if="value.tyoskentelypaikka.tyyppi === 'MUU'"
            >, {{ $t("kerro-mika") | lowercase }}
            <span class="text-primary">*</span></span
          ></b-form-radio
        >
        <div v-if="value.tyoskentelypaikka.tyyppi === 'MUU'" class="pl-4">
          <b-form-input
            v-model="value.tyoskentelypaikka.muuTyyppi"
            :state="validateState('tyoskentelypaikka.muuTyyppi')"
          ></b-form-input>
          <b-form-invalid-feedback>{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </div>
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
    <elsa-form-group
      :label="$t('tyoaika-taydesta-tyopaivasta')"
      :required="true"
    >
      <template v-slot="{ uid }">
        <div class="d-flex align-items-center">
          <b-form-input
            :id="uid"
            :value="value.osaaikaprosentti"
            @input="onOsaaikaprosenttiInput"
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
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-sm-12 col-md-6 pr-md-3"
        :required="true"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="value.alkamispaiva"
            :state="validateState('alkamispaiva')"
            :max="maxAlkamispaiva"
          ></elsa-form-datepicker>
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
          <elsa-form-datepicker
            :id="uid"
            v-model="value.paattymispaiva"
            :min="minPaattymispaiva"
            :aria-describedby="`${uid}-help`"
            class="datepicker-range"
          ></elsa-form-datepicker>
          <small :id="`${uid}-help`" class="form-text text-muted">{{
            $t("tyoskentelyjakson-minimikesto-on-30-taytta-tyopaivaa")
          }}</small>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('kaytannon-koulutus')" :required="true">
      <template v-slot="{ uid }">
        <b-form-radio
          v-model="value.kaytannonKoulutus"
          :state="validateState('kaytannonKoulutus')"
          name="kaytannon-koulutus-tyyppi"
          value="OMAN_ERIKOISALAN_KOULUTUS"
          >{{ $t("oman-erikoisalan-koulutus") }}</b-form-radio
        >
        <b-form-radio
          v-model="value.kaytannonKoulutus"
          :state="validateState('kaytannonKoulutus')"
          name="kaytannon-koulutus-tyyppi"
          value="REUNAKOULUTUS"
          class="mb-0"
          >{{ $t("omaa-erikoisalaa-tukeva-tai-taydentava-koulutus")
          }}<span v-if="value.kaytannonKoulutus === 'REUNAKOULUTUS'"
            >, {{ $t("valitse-erikoisala") | lowercase }}
            <span class="text-primary">*</span></span
          ></b-form-radio
        >
        <div v-if="value.kaytannonKoulutus === 'REUNAKOULUTUS'" class="pl-4">
          <b-form-input
            v-model="value.reunakoulutuksenNimi"
            :state="validateState('reunakoulutuksenNimi')"
          ></b-form-input>
          <b-form-invalid-feedback>{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </div>
        <b-form-radio
          v-model="value.kaytannonKoulutus"
          :state="validateState('kaytannonKoulutus')"
          name="kaytannon-koulutus-tyyppi"
          value="TUTKIMUSTYO"
          >{{ $t("tutkimustyo") }}</b-form-radio
        >
        <b-form-radio
          v-model="value.kaytannonKoulutus"
          :state="validateState('kaytannonKoulutus')"
          name="kaytannon-koulutus-tyyppi"
          value="TERVEYSKESKUSTYO"
          >{{ $t("terveyskeskustyo") }}</b-form-radio
        >
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group v-if="!modal" :label="$t('lisatiedot')">
      <template v-slot="{ uid }">
        <b-form-checkbox
          :id="uid"
          v-model="value.hyvaksyttyAiempaanErikoisalaan"
          >{{
            $t("tyoskentelyjakso-on-aiemmin-hyvaksytty-toiselle-erikoisalalle")
          }}</b-form-checkbox
        >
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button
        type="reset"
        variant="back"
        @click.stop.prevent="onCancelClick"
        >{{ $t("peruuta") }}</elsa-button
      >
      <elsa-button
        :loading="params.saving"
        type="submit"
        variant="primary"
        class="ml-2"
        >{{ $t("lisaa") }}</elsa-button
      >
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import axios from "axios";
import { Mixins, Prop } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required, between, requiredIf } from "vuelidate/lib/validators";
import { parseISO, addDays, subDays, formatISO } from "date-fns";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import ElsaFormDatepicker from "@/components/datepicker/datepicker.vue";
import ElsaButton from "@/components/button/button.vue";
import { clamp } from "@/utils/functions";

@Component({
  components: {
    ElsaFormGroup,
    ElsaFormMultiselect,
    ElsaFormDatepicker,
    ElsaButton
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
        },
        muuTyyppi: {
          required: requiredIf(function(value) {
            return value.tyyppi === "MUU";
          })
        }
      },
      osaaikaprosentti: {
        required,
        between: between(50, 100)
      },
      alkamispaiva: {
        required
      },
      kaytannonKoulutus: {
        required
      },
      reunakoulutuksenNimi: {
        required: requiredIf(function(value) {
          return value.kaytannonKoulutus === "REUNAKOULUTUS";
        })
      }
    }
  }
})
export default class TyoskentelyjaksoForm extends Mixins(validationMixin) {
  @Prop({ required: false, default: true })
  modal!: boolean;

  value = {
    alkamispaiva: null,
    paattymispaiva: null,
    osaaikaprosentti: 100,
    tyoskentelypaikka: {
      nimi: null,
      kunta: null,
      tyyppi: null,
      muuTyyppi: null
    },
    kaytannonKoulutus: null,
    reunakoulutuksenNimi: null,
    hyvaksyttyAiempaanErikoisalaan: null
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
  params = {
    saving: false
  };

  mounted() {
    // this.fetchKunnat();
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
    this.$emit("submit", this.value, this.params);
  }

  onCancelClick() {
    this.$emit("cancel");
  }

  onOsaaikaprosenttiInput(value: number) {
    this.value.osaaikaprosentti = value;
    this.value.paattymispaiva = null;
  }

  get maxAlkamispaiva() {
    if (this.value.paattymispaiva) {
      // Työskentelyjakson minimikesto on 30 täyttä työpäivää
      return formatISO(
        subDays(
          parseISO(this.value.paattymispaiva),
          Math.floor(30 * (100 / clamp(this.value.osaaikaprosentti, 50, 100))) -
            1
        ),
        { representation: "date" }
      );
    }
    return undefined;
  }

  get minPaattymispaiva() {
    if (this.value.alkamispaiva) {
      // Työskentelyjakson minimikesto on 30 täyttä työpäivää
      return formatISO(
        addDays(
          parseISO(this.value.alkamispaiva),
          Math.ceil(30 * (100 / clamp(this.value.osaaikaprosentti, 50, 100))) -
            1
        ),
        { representation: "date" }
      );
    }
    return undefined;
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
