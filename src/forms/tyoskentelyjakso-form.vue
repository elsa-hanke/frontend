<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('kunta')" :required="!editing">
      <template v-slot="{ uid }">
        <div v-if="!editing">
          <elsa-form-multiselect
            :id="uid"
            v-model="form.tyoskentelypaikka.kunta"
            :options="kunnat"
            :state="validateState('tyoskentelypaikka.kunta')"
            label="abbreviation"
            track-by="id"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </div>
        <div v-else>
          <span :id="uid">{{ form.tyoskentelypaikka.kunta.abbreviation }}</span>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyoskentelypaikka')" :required="!editing">
      <template v-slot="{ uid }">
        <div v-if="!editing">
          <b-form-input
            :id="uid"
            v-model="form.tyoskentelypaikka.nimi"
            :state="validateState('tyoskentelypaikka.nimi')"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </div>
        <div v-else>
          <span :id="uid">{{ form.tyoskentelypaikka.nimi }}</span>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyyppi')" :required="!editing">
      <template v-slot="{ uid }">
        <div v-if="!editing">
          <b-form-radio-group
            :id="uid"
            v-model="form.tyoskentelypaikka.tyyppi"
            :state="validateState('tyoskentelypaikka.tyyppi')"
            :options="tyypit"
            name="tyoskentelyjakso-tyyppi"
            stacked
          ></b-form-radio-group>
          <b-form-radio
            v-model="form.tyoskentelypaikka.tyyppi"
            :state="validateState('tyoskentelypaikka.tyyppi')"
            name="tyoskentelyjakso-tyyppi"
            value="MUU"
            >{{ $t("muu")
            }}<span v-if="form.tyoskentelypaikka.tyyppi === 'MUU'"
              >, {{ $t("kerro-mika") | lowercase }}
              <span class="text-primary">*</span></span
            ></b-form-radio
          >
          <div v-if="form.tyoskentelypaikka.tyyppi === 'MUU'" class="pl-4">
            <b-form-input
              v-model="form.tyoskentelypaikka.muuTyyppi"
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
        </div>
        <div v-else>
          <span :id="uid">{{ form.tyoskentelypaikka.tyyppiLabel }}</span
          ><span v-if="form.tyoskentelypaikka.muuTyyppi"
            >: {{ form.tyoskentelypaikka.muuTyyppi }}</span
          >
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tyoaika-taydesta-tyopaivasta')"
      :required="!editing"
    >
      <template v-slot="{ uid }">
        <div v-if="!editing">
          <div class="d-flex align-items-center">
            <b-form-input
              :id="uid"
              :value="form.osaaikaprosentti"
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
            >{{
              $t("osaaikaprosentti-validointivirhe")
            }}</b-form-invalid-feedback
          >
        </div>
        <div v-else>{{ form.osaaikaprosentti }} %</div>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-sm-12 col-md-6 pr-md-3"
        :required="!editing"
      >
        <template v-slot="{ uid }">
          <div v-if="!editing">
            <elsa-form-datepicker
              :id="uid"
              v-model="form.alkamispaiva"
              :state="validateState('alkamispaiva')"
              :max="maxAlkamispaiva"
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">{{
              $t("pakollinen-tieto")
            }}</b-form-invalid-feedback>
          </div>
          <div v-else>
            <span :id="uid" v-if="form.alkamispaiva">{{
              $date(form.alkamispaiva)
            }}</span>
          </div>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('paattymispaiva')"
        class="col-sm-12 col-md-6 pl-md-3"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.paattymispaiva"
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
    <elsa-form-group :label="$t('kaytannon-koulutus')" :required="!editing">
      <template v-slot="{ uid }">
        <div v-if="!editing">
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            value="OMAN_ERIKOISALAN_KOULUTUS"
            >{{ $t("oman-erikoisalan-koulutus") }}</b-form-radio
          >
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            value="OMAA_ERIKOISALAA_TUKEVA_KOULUTUS"
            class="mb-0"
            >{{ $t("omaa-erikoisalaa-tukeva-tai-taydentava-koulutus")
            }}<span
              v-if="
                form.kaytannonKoulutus === 'OMAA_ERIKOISALAA_TUKEVA_KOULUTUS'
              "
              >, {{ $t("valitse-erikoisala") | lowercase }}
              <span class="text-primary">*</span></span
            ></b-form-radio
          >
          <div
            v-if="form.kaytannonKoulutus === 'OMAA_ERIKOISALAA_TUKEVA_KOULUTUS'"
            class="pl-4"
          >
            <elsa-form-multiselect
              v-model="form.omaaErikoisalaaTukeva"
              :options="erikoisalatFormatted"
              :state="validateState('omaaErikoisalaaTukeva')"
              label="nimi"
              track-by="id"
            />
            <b-form-invalid-feedback>{{
              $t("pakollinen-tieto")
            }}</b-form-invalid-feedback>
          </div>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            value="TUTKIMUSTYO"
            >{{ $t("tutkimustyo") }}</b-form-radio
          >
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            value="TERVEYSKESKUSTYO"
            >{{ $t("terveyskeskustyo") }}</b-form-radio
          >
          <b-form-invalid-feedback :id="`${uid}-feedback`">{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </div>
        <div v-else>
          <span :id="uid">{{ form.kaytannonKoulutusLabel }}</span
          ><span v-if="form.omaaErikoisalaaTukeva"
            >: {{ form.omaaErikoisalaaTukeva.nimi }}</span
          >
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group v-if="!modal" :label="$t('lisatiedot')">
      <template v-slot="{ uid }">
        <b-form-checkbox
          :id="uid"
          v-model="form.hyvaksyttyAiempaanErikoisalaan"
          >{{
            $t("tyoskentelyjakso-on-aiemmin-hyvaksytty-toiselle-erikoisalalle")
          }}</b-form-checkbox
        >
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button variant="back" @click.stop.prevent="onCancel">{{
        $t("peruuta")
      }}</elsa-button>
      <elsa-button
        v-if="editing"
        @click="onTyoskentelyjaksoDelete"
        :loading="params.deleting"
        variant="outline-danger"
        class="ml-2"
        >{{ $t("poista-tyoskentelyjakso") }}</elsa-button
      >
      <elsa-button
        :loading="params.saving"
        type="submit"
        variant="primary"
        class="ml-2"
        >{{ editing ? $t("tallenna") : $t("lisaa") }}</elsa-button
      >
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins, Prop } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required, between, requiredIf } from "vuelidate/lib/validators";
import { parseISO, addDays, subDays, formatISO } from "date-fns";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import ElsaFormDatepicker from "@/components/datepicker/datepicker.vue";
import ElsaButton from "@/components/button/button.vue";
import { clamp } from "@/utils/functions";
import {
  tyoskentelypaikkaTyyppiLabel,
  tyoskentelyjaksoKaytannonKoulutusLabel
} from "@/utils/tyoskentelyjakso";

@Component({
  components: {
    ElsaFormGroup,
    ElsaFormMultiselect,
    ElsaFormDatepicker,
    ElsaButton
  },
  validations: {
    form: {
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
      omaaErikoisalaaTukeva: {
        required: requiredIf(function(value) {
          return value.kaytannonKoulutus === "OMAA_ERIKOISALAA_TUKEVA_KOULUTUS";
        })
      }
    }
  }
})
export default class TyoskentelyjaksoForm extends Mixins(validationMixin) {
  @Prop({ required: false, default: true })
  modal!: boolean;

  @Prop({ required: false, default: false })
  editing!: boolean;

  @Prop({ required: false, default: () => [] })
  kunnat!: any[];

  @Prop({ required: false, default: () => [] })
  erikoisalat!: any[];

  @Prop({
    required: false,
    type: Object,
    default: () => ({
      alkamispaiva: null,
      paattymispaiva: null,
      osaaikaprosentti: 100,
      tyoskentelypaikka: {
        nimi: null,
        kunta: {},
        tyyppi: null,
        muuTyyppi: null
      },
      kaytannonKoulutus: null,
      omaaErikoisalaaTukeva: null,
      hyvaksyttyAiempaanErikoisalaan: null
    })
  })
  value!: any;

  form = {
    alkamispaiva: null,
    paattymispaiva: null,
    osaaikaprosentti: 100,
    tyoskentelypaikka: {
      nimi: null,
      kunta: {},
      tyyppi: null,
      muuTyyppi: null
    },
    kaytannonKoulutus: null,
    omaaErikoisalaaTukeva: null,
    hyvaksyttyAiempaanErikoisalaan: null
  } as any;
  tyypit = [
    { text: this.$t("terveyskeskus"), value: "TERVEYSKESKUS" },
    { text: this.$t("keskussairaala"), value: "KESKUSSAIRAALA" },
    {
      text: this.$t("yliopistollinen-sairaala"),
      value: "YLIOPISTOLLINEN_SAIRAALA"
    },
    { text: this.$t("yksityinen"), value: "YKSITYINEN" }
  ];
  params = {
    saving: false,
    deleting: false
  };

  mounted() {
    this.form = {
      ...this.value,
      tyoskentelypaikka: {
        ...this.value.tyoskentelypaikka,
        tyyppiLabel: tyoskentelypaikkaTyyppiLabel(
          this,
          this.value.tyoskentelypaikka.tyyppi
        )
      },
      kaytannonKoulutusLabel: tyoskentelyjaksoKaytannonKoulutusLabel(
        this,
        this.value.kaytannonKoulutus
      )
    };
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
    const { $dirty, $error } = get(this.$v.form, name);
    return $dirty ? ($error ? false : null) : null;
  }

  onSubmit() {
    this.$v.form.$touch();
    if (this.$v.form.$anyError) {
      return;
    }
    this.$emit(
      "submit",
      {
        ...this.form,
        tyoskentelypaikka: {
          ...this.form.tyoskentelypaikka,
          kuntaId: this.form.tyoskentelypaikka.kunta?.id
        },
        omaaErikoisalaaTukevaId: this.form.omaaErikoisalaaTukeva?.id
      },
      this.params
    );
  }

  async onTyoskentelyjaksoDelete() {
    this.$emit("delete", this.params);
  }

  onOsaaikaprosenttiInput(value: number) {
    this.form.osaaikaprosentti = value;
    this.form.paattymispaiva = null;
  }

  onCancel() {
    this.$emit("cancel");
  }

  get maxAlkamispaiva() {
    if (this.form.paattymispaiva) {
      // Työskentelyjakson minimikesto on 30 täyttä työpäivää
      return formatISO(
        subDays(
          parseISO(this.form.paattymispaiva),
          Math.floor(30 * (100 / clamp(this.form.osaaikaprosentti, 50, 100))) -
            1
        ),
        { representation: "date" }
      );
    }
    return undefined;
  }

  get minPaattymispaiva() {
    if (this.form.alkamispaiva) {
      // Työskentelyjakson minimikesto on 30 täyttä työpäivää
      return formatISO(
        addDays(
          parseISO(this.form.alkamispaiva),
          Math.ceil(30 * (100 / clamp(this.form.osaaikaprosentti, 50, 100))) - 1
        ),
        { representation: "date" }
      );
    }
    return undefined;
  }

  get erikoisalatFormatted() {
    return [
      ...this.erikoisalat,
      {
        nimi: this.$t("muu")
      }
    ];
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
