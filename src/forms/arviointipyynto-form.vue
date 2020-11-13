<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('erikoistuva-laakari')">
      <template v-slot="{ uid }">
        <user-avatar :id="uid" :displayName="displayName" />
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
          :options="tyoskentelyjaksot"
          :state="validateState('tyoskentelyjakso')"
          @select="onTyoskentelyjaksoSelect"
          track-by="id"
        >
          <template slot="singleLabel" slot-scope="{ option }">
            {{ option.tyoskentelypaikka.nimi }} ({{
              $date(option.alkamispaiva)
            }}
            –
            {{
              option.paattymispaiva
                ? $date(option.paattymispaiva)
                : $t("kesken") | lowercase
            }})
          </template>
          <template slot="option" slot-scope="{ option }">
            {{ option.tyoskentelypaikka.nimi }} ({{
              $date(option.alkamispaiva)
            }}
            –
            {{
              option.paattymispaiva
                ? $date(option.paattymispaiva)
                : $t("kesken") | lowercase
            }})
          </template>
        </elsa-form-multiselect>
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
      <b-button type="reset" variant="back" :to="{ name: 'arvioinnit' }">{{
        $t("peruuta")
      }}</b-button>
      <b-button
        v-if="editing"
        @click="deleteArviointipyynto"
        variant="outline-danger"
        class="ml-2"
        >{{ $t("poista-arviointipyynto") }}</b-button
      >
      <b-button type="submit" variant="primary" class="ml-2">{{
        editing ? $t("tallenna") : $t("laheta")
      }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import axios from "axios";
import { Prop, Mixins } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { parseISO } from "date-fns";
import store from "@/store";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import KouluttajaForm from "@/forms/kouluttaja-form.vue";
import ElsaFormDatepicker from "@/components/datepicker/datepicker.vue";
import { toastSuccess, toastFail } from "@/utils/toast";

@Component({
  components: {
    KouluttajaForm,
    TyoskentelyjaksoForm,
    ElsaFormGroup,
    ElsaFormMultiselect,
    UserAvatar,
    ElsaFormDatepicker
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
export default class ArviointipyyntoForm extends Mixins(validationMixin) {
  @Prop({ required: false, default: [] })
  tyoskentelyjaksot!: any[];

  @Prop({ required: false, default: [] })
  epaOsaamisalueet!: any[];

  @Prop({ required: false, default: [] })
  kouluttajat!: any[];

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

  mounted() {
    this.form.tyoskentelyjakso = this.value.tyoskentelyjakso;
    this.form.epaOsaamisalue = this.value.epaOsaamisalue;
    this.form.arvioitavaTapahtuma = this.value.arvioitavaTapahtuma;
    this.form.kouluttaja = this.value.kouluttaja;
    this.form.tapahtumanAjankohta = this.value.tapahtumanAjankohta;
    this.form.lisatiedot = this.value.lisatiedot;
  }

  @Prop({ required: false, default: false })
  editing!: boolean;

  validateState(name: string) {
    const { $dirty, $error } = this.$v.form[name] as any;
    return $dirty ? ($error ? false : null) : null;
  }

  onSubmit() {
    this.$v.form.$touch();
    if (this.$v.form.$anyError) {
      return;
    }
    this.$emit("submit", {
      tyoskentelyjaksoId: this.form.tyoskentelyjakso?.id,
      arvioitavaOsaalueId: this.form.epaOsaamisalue?.id,
      arvioitavaTapahtuma: this.form.arvioitavaTapahtuma,
      arvioinninAntajaId: this.form.kouluttaja?.id,
      tapahtumanAjankohta: this.form.tapahtumanAjankohta,
      lisatiedot: this.form.lisatiedot
    });
  }

  onTyoskentelyjaksoSelect(value: any) {
    if (this.form.tapahtumanAjankohta) {
      if (
        isBefore(
          parseISO(this.form.tapahtumanAjankohta),
          parseISO(value.alkamispaiva)
        )
      ) {
        this.form.tapahtumanAjankohta = null;
      }
      if (value.paattymispaiva) {
        if (
          isAfter(
            parseISO(this.form.tapahtumanAjankohta),
            parseISO(value.paattymispaiva)
          )
        ) {
          this.form.tapahtumanAjankohta = null;
        }
      }
    }
  }

  async onTyoskentelyjaksoSubmit(value: any, modal: any) {
    try {
      const tyoskentelyjakso = (
        await axios.post("/erikoistuva-laakari/tyoskentelyjaksot", value)
      ).data;
      this.tyoskentelyjaksot.push(tyoskentelyjakso);
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

  async onKouluttajaSubmit(value: any, modal: any) {
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
  }

  async deleteArviointipyynto() {
    this.$emit("delete");
  }

  get displayName() {
    const account = store.getters.account;
    if (account) {
      return `${account.firstName} ${account.lastName}`;
    } else {
      return "";
    }
  }

  get currentLocale() {
    return this.$i18n.locale;
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
