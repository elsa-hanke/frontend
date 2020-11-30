<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('erikoistuva-laakari')">
      <template v-slot="{ uid }">
        <user-avatar :id="uid" />
      </template>
    </elsa-form-group>
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
    <elsa-form-group :label="$t('epa-osaamisalue')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.epaOsaamisalue"
          :options="epaOsaamisalueet"
          :state="validateState('epaOsaamisalue')"
          label="nimi"
          track-by="id"
        >
        </elsa-form-multiselect>
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('arvioitava-tapahtuma')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.arvioitavaTapahtuma"
          :state="validateState('arvioitavaTapahtuma')"
          :aria-describedby="`${uid}-feedback`"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('kouluttaja-tai-lahikouluttaja')"
        :add-new-enabled="!editing"
        :add-new-label="$t('lisaa-kouluttaja')"
        :required="true"
        @submit="onKouluttajaSubmit"
        class="col-md-8"
      >
        <template v-slot:modal-content="{ submit, cancel }">
          <kouluttaja-form @submit="submit" @cancel="cancel" />
        </template>
        <template v-slot="{ uid }">
          <elsa-form-multiselect
            :id="uid"
            v-model="form.kouluttaja"
            :options="kouluttajat"
            :state="validateState('kouluttaja')"
            :disabled="editing"
            label="nimi"
            track-by="nimi"
          >
            <template v-slot:option="{ option }">
              <user-avatar
                :displayName="option.nimi"
                :src-content-type="option.profiilikuvaContentType"
                :src-base64="option.profiilikuva"
              />
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
            v-model="form.tapahtumanAjankohta"
            :state="validateState('tapahtumanAjankohta')"
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
          v-model="form.lisatiedot"
          rows="5"
        ></b-form-textarea>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button variant="back" :to="{ name: 'arvioinnit' }">{{
        $t("peruuta")
      }}</elsa-button>
      <elsa-button
        v-if="editing"
        @click="onArviointipyyntoDelete"
        :loading="params.deleting"
        variant="outline-danger"
        class="ml-2"
        >{{ $t("poista-arviointipyynto") }}</elsa-button
      >
      <elsa-button
        :loading="params.saving"
        type="submit"
        variant="primary"
        class="ml-2"
        >{{ editing ? $t("tallenna") : $t("laheta") }}</elsa-button
      >
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import axios from "axios";
import { Prop, Mixins } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import TyoskentelyjaksoMixin from "@/mixins/tyoskentelyjakso";
import KouluttajaForm from "@/forms/kouluttaja-form.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import ElsaFormDatepicker from "@/components/datepicker/datepicker.vue";
import ElsaButton from "@/components/button/button.vue";
import { toastSuccess, toastFail } from "@/utils/toast";

@Component({
  components: {
    KouluttajaForm,
    TyoskentelyjaksoForm,
    ElsaFormGroup,
    ElsaFormMultiselect,
    UserAvatar,
    ElsaFormDatepicker,
    ElsaButton
  },
  validations: {
    form: {
      tyoskentelyjakso: {
        required
      },
      epaOsaamisalue: {
        required
      },
      arvioitavaTapahtuma: {
        required
      },
      kouluttaja: {
        required
      },
      tapahtumanAjankohta: {
        required
      }
    }
  }
})
export default class ArviointipyyntoForm extends Mixins(
  validationMixin,
  TyoskentelyjaksoMixin
) {
  @Prop({ required: false, default: [] })
  tyoskentelyjaksot!: any[];

  @Prop({ required: false, default: [] })
  epaOsaamisalueet!: any[];

  @Prop({ required: false, default: [] })
  kouluttajat!: any[];

  @Prop({ required: false, default: false })
  editing!: boolean;

  @Prop({
    required: false,
    type: Object,
    default: () => ({
      tyoskentelyjakso: null,
      epaOsaamisalue: null,
      arvioitavaTapahtuma: null,
      kouluttaja: null,
      tapahtumanAjankohta: null,
      lisatiedot: null
    })
  })
  value!: any;

  form = {
    tyoskentelyjakso: null,
    epaOsaamisalue: null,
    arvioitavaTapahtuma: null,
    kouluttaja: null,
    tapahtumanAjankohta: null,
    lisatiedot: null
  } as any;
  params = {
    saving: false,
    deleting: false
  };

  mounted() {
    this.form.tyoskentelyjakso = this.value.tyoskentelyjakso;
    this.form.epaOsaamisalue = this.value.epaOsaamisalue;
    this.form.arvioitavaTapahtuma = this.value.arvioitavaTapahtuma;
    this.form.kouluttaja = this.value.kouluttaja;
    this.form.tapahtumanAjankohta = this.value.tapahtumanAjankohta;
    this.form.lisatiedot = this.value.lisatiedot;
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
        tyoskentelyjaksoId: this.form.tyoskentelyjakso?.id,
        arvioitavaOsaalueId: this.form.epaOsaamisalue?.id,
        arvioitavaTapahtuma: this.form.arvioitavaTapahtuma,
        arvioinninAntajaId: this.form.kouluttaja?.id,
        tapahtumanAjankohta: this.form.tapahtumanAjankohta,
        lisatiedot: this.form.lisatiedot
      },
      this.params
    );
  }

  onArviointipyyntoDelete() {
    this.$emit("delete", this.params);
  }

  async onKouluttajaSubmit(value: any, params: any, modal: any) {
    params.saving = true;
    try {
      const kouluttaja = (
        await axios.post("/erikoistuva-laakari/lahikouluttajat", value)
      ).data;
      this.kouluttajat.push(kouluttaja);
      this.form.kouluttaja = kouluttaja;
      modal.hide("confirm");
      toastSuccess(this, this.$t("uusi-kouluttaja-lisatty"));
    } catch (err) {
      toastFail(this, this.$t("uuden-kouluttajan-lisaaminen-epaonnistui"));
    }
    params.saving = false;
  }
}
</script>
