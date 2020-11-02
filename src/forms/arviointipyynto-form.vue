<template>
  <b-form @submit="onSubmit">
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
          :required="true"
          track-by="id"
        >
          <template slot="singleLabel" slot-scope="{ option }">
            {{ option.tyoskentelypaikka.nimi }} ({{ option.alkamispaiva }} –
            {{
              option.paattymispaiva
                ? option.paattymispaiva
                : $t("kesken") | lowercase
            }})
          </template>
          <template slot="option" slot-scope="{ option }">
            {{ option.tyoskentelypaikka.nimi }} ({{ option.alkamispaiva }} –
            {{
              option.paattymispaiva
                ? option.paattymispaiva
                : $t("kesken") | lowercase
            }})
          </template>
        </elsa-multiselect>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('epa-osaamisalue')" :required="true">
      <template v-slot="{ uid }">
        <elsa-multiselect
          :id="uid"
          v-model="value.epaOsaamisalue"
          :options="epaOsaamisalueet"
          :required="true"
          label="nimi"
          track-by="id"
        >
        </elsa-multiselect>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('arvioitava-tapahtuma')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.arvioitavaTapahtuma"
          :required="true"
        ></b-form-input>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('kouluttaja-tai-lahikouluttaja')"
        :add-new-label="$t('lisaa-lahikouluttaja')"
        :required="true"
        class="col-md-8"
      >
        <template v-slot:modal-content>
          <lahikouluttaja-form />
        </template>
        <template v-slot="{ uid }">
          <elsa-multiselect
            :id="uid"
            v-model="value.kouluttaja"
            :options="kouluttajat"
            :required="true"
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
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('ajankohta')" class="col-md-4">
        <template v-slot="{ uid }">
          <b-form-datepicker
            :id="uid"
            v-model="value.tapahtumanAjankohta"
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
      <b-button
        type="reset"
        variant="link"
        :to="{ name: 'arvioinnit' }"
        class="text-decoration-none font-weight-500 mr-2"
        >{{ $t("peruuta") }}</b-button
      >
      <b-button type="submit" variant="primary">{{ $t("laheta") }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import axios from "axios";
import store from "@/store";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaMultiselect from "@/components/multiselect/multiselect.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import LahikouluttajaForm from "@/forms/lahikouluttaja-form.vue";

@Component({
  components: {
    ElsaFormGroup,
    LahikouluttajaForm,
    ElsaMultiselect,
    TyoskentelyjaksoForm,
    UserAvatar
  }
})
export default class ArviointipyyntoForm extends Vue {
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

  onSubmit(event: any) {
    event.preventDefault();
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
      this.$bvToast.toast(this.$t("uusi-tyoskentelyjakso-lisatty") as string, {
        title: this.$t("tyoskentelyjakson-lisaaminen") as string,
        variant: "success",
        solid: true
      });
    } catch (err) {
      this.$bvToast.toast(
        this.$t("uuden-tyoskentelyjakson-lisaaminen-epaonnistui") as string,
        {
          title: this.$t("tyoskentelyjakson-lisaaminen") as string,
          variant: "danger",
          solid: true
        }
      );
    }
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
