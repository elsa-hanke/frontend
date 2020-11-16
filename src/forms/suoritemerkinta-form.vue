<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group
      :label="$t('tyoskentelyjakso')"
      :add-new-enabled="true"
      :add-new-label="$t('lisaa-tyoskentelyjakso')"
      :required="true"
      @submit="onTyoskentelyjaksoSubmit"
    >
      <template v-slot:modal-content="{ submit, cancel }">
        <tyoskentelyjakso-form @submit="submit" @cancel="cancel" />
      </template>
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="value.tyoskentelyjakso"
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
    <elsa-form-group :label="$t('oppimistavoite')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="value.oppimistavoite"
          :options="oppimistavoitteenKategoriat"
          :state="validateState('oppimistavoite')"
          group-values="oppimistavoitteet"
          group-label="nimi"
          :group-select="false"
          label="nimi"
          track-by="id"
        >
          <template slot="option" slot-scope="props">
            <span v-if="props.option.$isLabel">{{
              props.option.$groupLabel
            }}</span>
            <span v-else class="ml-3">{{ props.option.nimi }}</span>
          </template>
        </elsa-form-multiselect>
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('vaativuustaso')" :required="true">
      <template #label-help>
        <elsa-popover>
          <template>
            <h2>{{ $t("vaativuustaso") }}</h2>
            <div v-for="(taso, index) in vaativuustasot" :key="index">
              <h3>{{ taso.arvo }} {{ $t(taso.nimi) }}</h3>
              <p>{{ $t(taso.kuvaus) }}</p>
            </div>
          </template>
        </elsa-popover>
      </template>
      <template v-slot:modal-content>
        <tyoskentelyjakso-form />
      </template>
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="value.vaativuustaso"
          :options="vaativuustasot"
          :state="validateState('vaativuustaso')"
          :custom-label="value => `${value.arvo} ${value.nimi}`"
          track-by="arvo"
        >
          <template slot="singleLabel" slot-scope="{ option }">
            <span class="font-weight-700">{{ option.arvo }}</span>
            {{ $t(option.nimi) }}
          </template>
          <template slot="option" slot-scope="{ option }">
            <span class="font-weight-700">{{ option.arvo }}</span>
            {{ $t(option.nimi) }}
          </template>
        </elsa-form-multiselect>
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('luottamuksen-taso')"
        :required="true"
        class="col-md-8"
      >
        <template #label-help>
          <elsa-popover>
            <template>
              <h2>{{ $t("luottamuksen-taso") }}</h2>
              <div v-for="(taso, index) in luottamuksenTasot" :key="index">
                <h3>{{ taso.arvo }} {{ $t(taso.nimi) }}</h3>
                <p>{{ $t(taso.kuvaus) }}</p>
              </div>
            </template>
          </elsa-popover>
        </template>
        <template v-slot="{ uid }">
          <elsa-form-multiselect
            :id="uid"
            v-model="value.luottamuksenTaso"
            :options="luottamuksenTasot"
            :state="validateState('luottamuksenTaso')"
            :custom-label="value => `${value.arvo} ${value.nimi}`"
            track-by="arvo"
          >
            <template slot="singleLabel" slot-scope="{ option }">
              <span class="font-weight-700">{{ option.arvo }}</span>
              {{ $t(option.nimi) }}
            </template>
            <template slot="option" slot-scope="{ option }">
              <span class="font-weight-700">{{ option.arvo }}</span>
              {{ $t(option.nimi) }}
            </template>
          </elsa-form-multiselect>
          <b-form-invalid-feedback :id="`${uid}-feedback`">{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('ajankohta')"
        class="col-md-4"
        :required="true"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="value.suorituspaiva"
            :state="validateState('suorituspaiva')"
            :min="tyoskentelyjaksonAlkamispaiva"
            :max="tyoskentelyjaksonPaattymispaiva"
          ></elsa-form-datepicker>
          <b-form-invalid-feedback :id="`${uid}-feedback`">{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('lisatiedot')">
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="value.lisatiedot"
          rows="5"
        ></b-form-textarea>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <b-button type="reset" variant="back" :to="{ name: 'arvioinnit' }">{{
        $t("peruuta")
      }}</b-button>
      <b-button type="submit" variant="primary" class="ml-2">{{
        $t("tallenna")
      }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import axios from "axios";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import { Mixins, Prop } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { parseISO } from "date-fns";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import ElsaPopover from "@/components/popover/popover.vue";
import ElsaFormDatepicker from "@/components/datepicker/datepicker.vue";
import { vaativuustasot, luottamuksenTasot } from "@/utils/constants";
import { toastSuccess, toastFail } from "@/utils/toast";
import { tyoskentelyjaksoLabel } from "@/utils/tyoskentelyjakso";

@Component({
  components: {
    TyoskentelyjaksoForm,
    ElsaFormGroup,
    ElsaFormMultiselect,
    ElsaPopover,
    ElsaFormDatepicker
  },
  validations: {
    value: {
      tyoskentelyjakso: {
        required
      },
      oppimistavoite: {
        required
      },
      vaativuustaso: {
        required
      },
      luottamuksenTaso: {
        required
      },
      suorituspaiva: {
        required
      }
    }
  }
})
export default class SuoritemerkintaForm extends Mixins(validationMixin) {
  @Prop({ required: false, default: [] })
  tyoskentelyjaksot!: any[];

  @Prop({ required: false, default: [] })
  oppimistavoitteenKategoriat!: any[];

  @Prop({
    required: false,
    type: Object,
    default: () => ({
      tyoskentelyjakso: null,
      oppimistavoite: null,
      vaativuustaso: null,
      luottamuksenTaso: null,
      suorituspaiva: null,
      lisatiedot: null
    })
  })
  value!: any;

  form = {
    tyoskentelyjakso: null,
    oppimistavoite: null,
    vaativuustaso: null,
    luottamuksenTaso: null,
    suorituspaiva: null,
    lisatiedot: null
  } as any;

  vaativuustasot = vaativuustasot;
  luottamuksenTasot = luottamuksenTasot;

  validateState(name: string) {
    const { $dirty, $error } = this.$v.value[name] as any;
    return $dirty ? ($error ? false : null) : null;
  }

  onTyoskentelyjaksoSelect(value: any) {
    if (this.form.suorituspaiva) {
      if (
        isBefore(
          parseISO(this.form.suorituspaiva),
          parseISO(value.alkamispaiva)
        )
      ) {
        this.form.suorituspaiva = null;
      }
      if (value.paattymispaiva) {
        if (
          isAfter(
            parseISO(this.form.suorituspaiva),
            parseISO(value.paattymispaiva)
          )
        ) {
          this.form.suorituspaiva = null;
        }
      }
    }
  }

  onSubmit() {
    this.$v.value.$touch();
    if (this.$v.value.$anyError) {
      return;
    }
    this.$emit("submit", {});
  }

  async onTyoskentelyjaksoSubmit(value: any, modal: any) {
    try {
      const tyoskentelyjakso = (
        await axios.post("/erikoistuva-laakari/tyoskentelyjaksot", value)
      ).data;
      this.tyoskentelyjaksot.push(tyoskentelyjakso);
      tyoskentelyjakso.label = tyoskentelyjaksoLabel(this, tyoskentelyjakso);
      this.form.tyoskentelyjakso = tyoskentelyjakso;
      this.onTyoskentelyjaksoSelect(tyoskentelyjakso);
      modal.hide("confirm");
      toastSuccess(this, this.$t("uusi-tyoskentelyjakso-lisatty"));
    } catch (err) {
      toastFail(
        this,
        this.$t("uuden-tyoskentelyjakson-lisaaminen-epaonnistui")
      );
    }
  }

  get tyoskentelyjaksotFormatted() {
    return this.tyoskentelyjaksot.map(tj => ({
      ...tj,
      label: tyoskentelyjaksoLabel(this, tj)
    }));
  }

  get tyoskentelyjaksonAlkamispaiva() {
    if (this.form.tyoskentelyjakso) {
      return this.form.tyoskentelyjakso.alkamispaiva;
    }
    return undefined;
  }

  get tyoskentelyjaksonPaattymispaiva() {
    if (this.form.tyoskentelyjakso) {
      return this.form.tyoskentelyjakso.paattymispaiva;
    }
    return undefined;
  }
}
</script>
