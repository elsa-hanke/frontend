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
      @submit="onTyoskentelypaikkaSubmit"
    >
      <template v-slot:modal-content="{ submit, cancel }">
        <tyoskentelyjakso-form @submit="submit" @cancel="cancel" />
      </template>
      <template v-slot="{ uid }">
        <elsa-multiselect
          :id="uid"
          v-model="value.tyoskentelyjakso"
          :options="tyoskentelyjaksot"
          :state="validateState('tyoskentelyjakso')"
          track-by="id"
        >
          <template slot="singleLabel" slot-scope="{ option }">
            {{ option.tyoskentelypaikka.nimi }} ({{ option.alkamispaiva }} –
            {{
              option.paattymispaiva
                ? $date(option.paattymispaiva)
                : $t("kesken") | lowercase
            }})
          </template>
          <template slot="option" slot-scope="{ option }">
            {{ option.tyoskentelypaikka.nimi }} ({{ option.alkamispaiva }} –
            {{
              option.paattymispaiva
                ? $date(option.paattymispaiva)
                : $t("kesken") | lowercase
            }})
          </template>
        </elsa-multiselect>
        <b-form-invalid-feedback
          :id="`${uid}-feedback`"
          :style="{
            display:
              validateState('tyoskentelyjakso') === false ? 'block' : 'none'
          }"
          >{{ $t("pakollinen-tieto") }}</b-form-invalid-feedback
        >
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('epa-osaamisalue')" :required="true">
      <template v-slot="{ uid }">
        <elsa-multiselect
          :id="uid"
          v-model="value.epaOsaamisalue"
          :options="epaOsaamisalueet"
          :state="validateState('epaOsaamisalue')"
          label="nimi"
          track-by="id"
        >
        </elsa-multiselect>
        <b-form-invalid-feedback
          :id="`${uid}-feedback`"
          :style="{
            display:
              validateState('epaOsaamisalue') === false ? 'block' : 'none'
          }"
          >{{ $t("pakollinen-tieto") }}</b-form-invalid-feedback
        >
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('arvioitava-tapahtuma')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.arvioitavaTapahtuma"
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
        :add-new-label="$t('lisaa-lahikouluttaja')"
        :required="true"
        @submit="onLahikouluttajaSubmit"
        class="col-md-8"
      >
        <template v-slot:modal-content="{ submit, cancel }">
          <lahikouluttaja-form @submit="submit" @cancel="cancel" />
        </template>
        <template v-slot="{ uid }">
          <elsa-multiselect
            :id="uid"
            v-model="value.kouluttaja"
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
          </elsa-multiselect>
          <b-form-invalid-feedback
            :id="`${uid}-feedback`"
            :style="{
              display: validateState('kouluttaja') === false ? 'block' : 'none'
            }"
            >{{ $t("pakollinen-tieto") }}</b-form-invalid-feedback
          >
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('ajankohta')"
        class="col-md-4"
        :required="true"
      >
        <template v-slot="{ uid }">
          <b-form-datepicker
            :id="uid"
            v-model="value.tapahtumanAjankohta"
            :state="validateState('tapahtumanAjankohta')"
            start-weekday="1"
            :locale="currentLocale"
            :min="tyoskentelyjaksonAlkamispaiva"
            :max="tyoskentelyjaksonPaattymispaiva"
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
                class="text-primary"/></template
          ></b-form-datepicker>
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
import store from "@/store";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaMultiselect from "@/components/multiselect/multiselect.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import LahikouluttajaForm from "@/forms/lahikouluttaja-form.vue";
import { toastSuccess, toastFail } from "@/utils/toast";

@Component({
  components: {
    ElsaFormGroup,
    LahikouluttajaForm,
    ElsaMultiselect,
    TyoskentelyjaksoForm,
    UserAvatar
  },
  validations: {
    value: {
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

  @Prop({ required: false, default: false })
  editing!: boolean;

  validateState(name: string) {
    const { $dirty, $error } = this.$v.value[name] as any;
    return $dirty ? ($error ? false : null) : null;
  }

  onSubmit() {
    this.$v.value.$touch();
    if (this.$v.value.$anyError) {
      return;
    }
    this.$emit("submit", {
      tyoskentelyjaksoId: this.value.tyoskentelyjakso?.id,
      arvioitavaOsaalueId: this.value.epaOsaamisalue?.id,
      arvioitavaTapahtuma: this.value.arvioitavaTapahtuma,
      arvioinninAntajaId: this.value.kouluttaja?.id,
      tapahtumanAjankohta: this.value.tapahtumanAjankohta,
      lisatiedot: this.value.lisatiedot
    });
  }

  async onTyoskentelypaikkaSubmit(value: any, modal: any) {
    try {
      const tyoskentelyjakso = (
        await axios.post("/erikoistuva-laakari/tyoskentelyjaksot", value)
      ).data;
      this.tyoskentelyjaksot.push(tyoskentelyjakso);
      this.value.tyoskentelyjakso = tyoskentelyjakso;
      modal.hide("confirm");
      toastSuccess(this, this.$t("uusi-tyoskentelyjakso-lisatty"));
    } catch (err) {
      toastFail(
        this,
        this.$t("uuden-tyoskentelyjakson-lisaaminen-epaonnistui")
      );
    }
  }

  async onLahikouluttajaSubmit(value: any, modal: any) {
    try {
      const lahikouluttaja = (
        await axios.post("/erikoistuva-laakari/lahikouluttajat", value)
      ).data;
      this.kouluttajat.push(lahikouluttaja);
      this.value.kouluttaja = lahikouluttaja;
      modal.hide("confirm");
      toastSuccess(this, this.$t("uusi-lahikouluttaja-lisatty"));
    } catch (err) {
      toastFail(this, this.$t("uuden-lahikouluttajan-lisaaminen-epaonnistui"));
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
    if (this.value.tyoskentelyjakso) {
      return this.value.tyoskentelyjakso.alkamispaiva;
    }
    return undefined;
  }

  get tyoskentelyjaksonPaattymispaiva() {
    if (this.value.tyoskentelyjakso) {
      return this.value.tyoskentelyjakso.paattymispaiva;
    }
    return undefined;
  }
}
</script>
