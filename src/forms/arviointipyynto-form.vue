<template>
  <b-form @submit="onSubmit">
    <b-form-group :label-for="arviointipyyntoErikoistuvaLaakariId"
      ><template v-slot:label>{{ $t("erikoistuva-laakari") }}</template
      ><user-avatar
        :id="arviointipyyntoErikoistuvaLaakariId"
        :displayName="displayName"
      />
    </b-form-group>
    <elsa-form-group
      :label-for="arviointipyyntoTyoskentelyjaksoId"
      :label="$t('tyoskentelyjakso')"
      :add-new="onSubmit2"
      :add-new-label="$t('lisaa-tyoskentelyjakso')"
      :required="true"
    >
      <template v-slot:modal-content>
        <tyoskentelyjakso-form />
      </template>
      <multiselect
        :id="arviointipyyntoTyoskentelyjaksoId"
        v-model="form.tyoskentelyjakso"
        :options="tyoskentelyjaksot"
        :placeholder="$t('valitse')"
        label="name"
        track-by="name"
      >
        <template slot="noResult">
          <div>{{ $t("ei-hakutuloksia") }}</div>
        </template>
        <template slot="noOptions">{{ $t("ei-vaihtoehtoja") }}</template>
      </multiselect>
    </elsa-form-group>
    <b-form-group :label-for="arviointipyyntoEpaOsaamisalueId"
      ><template v-slot:label
        ><div class="text-nowrap">
          {{ $t("epa-osaamisalue") }}
          <span class="text-primary">*</span>
        </div></template
      >
      <multiselect
        :id="arviointipyyntoEpaOsaamisalueId"
        v-model="form.epaOsaamisalue"
        :options="epaOsaamisalueet"
        :placeholder="$t('valitse')"
        label="name"
        track-by="name"
      >
        <template slot="noResult">
          <div>{{ $t("ei-hakutuloksia") }}</div>
        </template>
        <template slot="noOptions">{{ $t("ei-vaihtoehtoja") }}</template>
      </multiselect>
    </b-form-group>
    <b-form-group label-for="arviointipyynto-arvioitava-tapahtuma"
      ><template v-slot:label
        ><div class="text-nowrap">
          {{ $t("arvioitava-tapahtuma") }}
          <span class="text-primary">*</span>
        </div></template
      ><b-form-input
        id="arviointipyynto-arvioitava-tapahtuma"
        v-model="form.arvioitavaTapahtuma"
      ></b-form-input>
    </b-form-group>
    <b-form-row>
      <elsa-form-group
        :label-for="arviointipyyntoKouluttajaId"
        :label="$t('kouluttaja')"
        :add-new="onSubmit2"
        :add-new-label="$t('lisaa-kouluttaja')"
        :required="true"
        class="col-md-8"
      >
        <template v-slot:modal-content>
          <kouluttaja-form />
        </template>
        <multiselect
          :id="arviointipyyntoKouluttajaId"
          v-model="form.kouluttaja"
          :options="kouluttajat"
          :placeholder="$t('valitse')"
          label="name"
          track-by="name"
        >
          <template slot="noResult">
            <div>{{ $t("ei-hakutuloksia") }}</div>
          </template>
          <template slot="noOptions">{{ $t("ei-vaihtoehtoja") }}</template>
        </multiselect>
      </elsa-form-group>
      <b-form-group :label-for="arviointipyyntoAjankohtaId" class="col-md-4"
        ><template v-slot:label
          ><div class="text-nowrap">
            {{ $t("ajankohta") }} <span class="text-primary">*</span>
          </div></template
        ><b-form-datepicker
          :id="arviointipyyntoAjankohtaId"
          v-model="form.ajankohta"
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
          ><template v-slot:button-content
            ><font-awesome-icon
              :icon="['far', 'calendar-alt']"
              class="text-primary"/></template></b-form-datepicker
      ></b-form-group>
    </b-form-row>
    <b-form-group :label-for="arviointipyyntolisatiedotId"
      ><template v-slot:label>{{ $t("lisatiedot") }}</template
      ><b-form-textarea
        :id="arviointipyyntolisatiedotId"
        v-model="form.lisatiedot"
        rows="5"
      ></b-form-textarea
    ></b-form-group>
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
import Multiselect from "vue-multiselect";
import store from "@/store";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import kouluttajaForm from "@/forms/kouluttaja-form.vue";

@Component({
  components: {
    ElsaFormGroup,
    kouluttajaForm,
    Multiselect,
    TyoskentelyjaksoForm,
    UserAvatar
  }
})
export default class ArviointipyyntoForm extends Vue {
  form = {
    tyoskentelyjakso: null,
    epaOsaamisalue: null,
    arvioitavaTapahtuma: null,
    kouluttaja: null,
    ajankohta: null,
    lisatiedot: null
  };

  tyoskentelyjaksot = [];
  epaOsaamisalueet = [];
  kouluttajat = [];

  onSubmit(event: any) {
    event.preventDefault();
    console.log("onSubmit", this.form);
    this.$emit("submit", this.form);
  }

  onSubmit2() {
    console.log("onSubmit2");
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

  get uid() {
    return (this as any)._uid;
  }

  get arviointipyyntoErikoistuvaLaakariId() {
    return `arviointipyynto-erikoistuva-laakari-${this.uid}`;
  }

  get arviointipyyntoTyoskentelyjaksoId() {
    return `arviointipyynto-tyoskentelyjakso-${this.uid}`;
  }

  get arviointipyyntoEpaOsaamisalueId() {
    return `arviointipyynto-epa-osaamisalue-${this.uid}`;
  }

  get arviointipyyntoArvioitavaTapahtumaId() {
    return `arviointipyynto-arvioitava-tapahtuma-${this.uid}`;
  }

  get arviointipyyntoKouluttajaId() {
    return `arviointipyynto-kouluttaja-${this.uid}`;
  }

  get arviointipyyntoAjankohtaId() {
    return `arviointipyynto-ajankohta-${this.uid}`;
  }

  get arviointipyyntolisatiedotId() {
    return `arviointipyynto-lisatiedot-${this.uid}`;
  }
}
</script>

<style lang="scss" scoped></style>
