<template>
  <b-form @submit="onSubmit">
    <elsa-form-group :label="$t('erikoistuva-laakari')">
      <template v-slot="{ uid }">
        <user-avatar :id="uid" :displayName="displayName" />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tyoskentelyjakso')"
      :add-new="onSubmit2"
      :add-new-label="$t('lisaa-tyoskentelyjakso')"
      :required="true"
    >
      <template v-slot:modal-content>
        <tyoskentelyjakso-form />
      </template>
      <template v-slot="{ uid }">
        <multiselect
          :id="uid"
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
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('epa-osaamisalue')" :required="true">
      <template v-slot="{ uid }">
        <multiselect
          :id="uid"
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
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('arvioitava-tapahtuma')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.arvioitavaTapahtuma"
        ></b-form-input>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('kouluttaja-tai-lahikouluttaja')"
        :add-new="onSubmit2"
        :add-new-label="$t('lisaa-lahikouluttaja')"
        :required="true"
        class="col-md-8"
      >
        <template v-slot:modal-content>
          <lahikouluttaja-form />
        </template>
        <template v-slot="{ uid }">
          <multiselect
            :id="uid"
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
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('ajankohta')" class="col-md-4">
        <template v-slot="{ uid }">
          <b-form-datepicker
            :id="uid"
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
                class="text-primary"/></template
          ></b-form-datepicker>
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
import LahikouluttajaForm from "@/forms/lahikouluttaja-form.vue";

@Component({
  components: {
    ElsaFormGroup,
    LahikouluttajaForm,
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
}
</script>

<style lang="scss" scoped></style>
