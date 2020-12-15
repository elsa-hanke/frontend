<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('possaolon-syy')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.poissaolonSyy"
          :options="poissaoloSyyt"
          :state="validateState('poissaolonSyy')"
          label="nimi"
          track-by="id"
        />
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tyoskentelyjakso')"
      :required="true"
      @submit="onTyoskentelyjaksoSubmit"
    >
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.tyoskentelyjakso"
          :options="tyoskentelyjaksotFormatted"
          :state="validateState('tyoskentelyjakso')"
          @select="onTyoskentelyjaksoSelect"
          label="label"
          track-by="id"
        />
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
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
            v-model="form.alkamispaiva"
            :state="validateState('alkamispaiva')"
            :min="minAlkamispaiva"
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
        :required="true"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.paattymispaiva"
            :state="validateState('paattymispaiva')"
            :min="minPaattymispaiva"
            :max="maxPaattymispaiva"
            class="datepicker-range"
          ></elsa-form-datepicker>
          <b-form-invalid-feedback :id="`${uid}-feedback`">{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <b-form-checkbox v-model="form.kokoTyoajanPoissaolo" class="mb-3">{{
      $t("koko-tyoajan-poissaolo")
    }}</b-form-checkbox>
    <elsa-form-group
      v-if="!form.kokoTyoajanPoissaolo"
      :label="$t('tyoaika-taydesta-tyopaivasta') + ' (0-100 %)'"
      :required="true"
    >
      <template v-slot="{ uid }">
        <div class="d-flex align-items-center">
          <b-form-input
            :id="uid"
            v-model.number="form.osaaikaprosentti"
            :state="validateState('osaaikaprosentti')"
            type="number"
            step="any"
          />
          <span class="mx-3">%</span>
        </div>
        <b-form-invalid-feedback
          :id="`${uid}-feedback`"
          :style="{
            display:
              validateState('osaaikaprosentti') === false ? 'block' : 'none'
          }"
          >{{ $t("osaaikaprosentti-validointivirhe") }} 0–100
          %</b-form-invalid-feedback
        >
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button variant="back" :to="{ name: 'tyoskentelyjaksot' }">{{
        $t("peruuta")
      }}</elsa-button>
      <elsa-button
        v-if="value.id"
        @click="onDelete"
        :loading="params.deleting"
        variant="outline-danger"
        >{{ $t("poista-poissaolo") }}</elsa-button
      >
      <elsa-button
        :loading="params.saving"
        type="submit"
        variant="primary"
        class="ml-2"
        >{{ $t("tallenna") }}</elsa-button
      >
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins, Prop } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required, requiredIf, integer } from "vuelidate/lib/validators";
import TyoskentelyjaksoMixin from "@/mixins/tyoskentelyjakso";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import ElsaPopover from "@/components/popover/popover.vue";
import ElsaFormDatepicker from "@/components/datepicker/datepicker.vue";
import ElsaButton from "@/components/button/button.vue";
import { dateBetween } from "@/utils/date";

@Component({
  components: {
    TyoskentelyjaksoForm,
    ElsaFormGroup,
    ElsaFormMultiselect,
    ElsaPopover,
    ElsaFormDatepicker,
    ElsaButton
  },
  validations: {
    form: {
      poissaolonSyy: {
        required
      },
      tyoskentelyjakso: {
        required
      },
      alkamispaiva: {
        required
      },
      paattymispaiva: {
        required
      },
      kokoTyoajanPoissaolo: {
        required
      },
      osaaikaprosentti: {
        required: requiredIf(value => {
          if (value.osaaikaprosentti < 0 || value.osaaikaprosentti > 100) {
            return false;
          }
          return value.kokoTyoajanPoissaolo === false;
        }),
        integer
      }
    }
  }
})
export default class PoissaoloForm extends Mixins(
  validationMixin,
  TyoskentelyjaksoMixin
) {
  @Prop({ required: false, default: () => [] })
  poissaoloSyyt!: any[];

  @Prop({
    required: false,
    type: Object,
    default: () => ({
      poissaolonSyy: null,
      tyoskentelyjakso: null,
      alkamispaiva: null,
      paattymispaiva: null,
      kokoTyoajanPoissaolo: true,
      osaaikaprosentti: null
    })
  })
  value!: any;

  form = {
    poissaolonSyy: null,
    tyoskentelyjakso: null,
    alkamispaiva: null,
    paattymispaiva: null,
    kokoTyoajanPoissaolo: null,
    osaaikaprosentti: null
  } as any;
  params = {
    saving: false,
    deleting: false
  };

  mounted() {
    this.form = this.value;
  }

  validateState(name: string) {
    const { $dirty, $error } = this.$v.form[name] as any;
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
        poissaolonSyyId: this.form.poissaolonSyy?.id,
        tyoskentelyjaksoId: this.form.tyoskentelyjakso?.id,
        osaaikaprosentti: this.form.kokoTyoajanPoissaolo
          ? 0
          : this.form.osaaikaprosentti
      },
      this.params
    );
  }

  onDelete() {
    this.$emit("delete", this.params);
  }

  onTyoskentelyjaksoSelect(value: any) {
    if (
      !dateBetween(
        this.form.alkamispaiva,
        value.alkamispaiva,
        value.paattymispaiva
      )
    ) {
      this.form.alkamispaiva = null;
    }
    if (
      !dateBetween(
        this.form.paattymispaiva,
        value.alkamispaiva,
        value.paattymispaiva
      )
    ) {
      this.form.paattymispaiva = null;
    }
  }

  get minAlkamispaiva() {
    return this.form.tyoskentelyjakso?.alkamispaiva;
  }

  get maxAlkamispaiva() {
    return (
      this.form.paattymispaiva || this.form.tyoskentelyjakso?.paattymispaiva
    );
  }

  get minPaattymispaiva() {
    return this.form.alkamispaiva || this.form.tyoskentelyjakso?.alkamispaiva;
  }

  get maxPaattymispaiva() {
    return this.form.tyoskentelyjakso?.paattymispaiva;
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
