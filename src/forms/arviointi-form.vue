<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group
      :label="$t('erikoistuva-laakari')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <user-avatar :id="uid" :displayName="displayName" />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tyoskentelyjakso')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">
          {{ value.tyoskentelyjakso.tyoskentelypaikka.nimi }} ({{
            $date(value.tyoskentelyjakso.alkamispaiva)
          }}
          –
          {{
            value.tyoskentelyjakso.paattymispaiva
              ? $date(value.tyoskentelyjakso.paattymispaiva)
              : $t("kesken") | lowercase
          }})</span
        >
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('epa-osaamisalue')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">{{ value.arvioitavaOsaalue.nimi }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('arvioitava-tapahtuma')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">{{ value.arvioitavaTapahtuma }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('kouluttaja')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <user-avatar :id="uid" :displayName="value.arvioinninAntaja.nimi" />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('ajankohta')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">{{ $date(value.tapahtumanAjankohta) }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('lisatiedot')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">{{ value.lisatiedot }}</span>
      </template>
    </elsa-form-group>
    <div v-if="!editing">
      <b-table-simple responsive bordered>
        <thead>
          <tr>
            <th scope="col" style="width: 20%;"></th>
            <th scope="col" style="width: 40%;">{{ $t("arviointi") }}</th>
            <th scope="col" style="width: 40%;">
              {{ $t("itsearviointi") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{{ $t("vaativuustaso") }}</th>
            <td>
              <elsa-luottamuksen-taso :value="value.vaativuustaso" />
            </td>
            <td>
              <elsa-luottamuksen-taso
                :value="value.itsearviointiVaativuustaso"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">{{ $t("luottamuksen-taso") }}</th>
            <td>
              <elsa-luottamuksen-taso :value="value.luottamuksenTaso" />
            </td>
            <td>
              <elsa-luottamuksen-taso
                :value="value.itsearviointiLuottamuksenTaso"
              />
            </td>
          </tr>
        </tbody>
      </b-table-simple>
      <elsa-form-group :label="$t('sanallinen-arviointi')">
        <template v-slot="{ uid }">
          <p :id="uid">{{ value.sanallinenArviointi }}</p>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('sanallinen-itsearviointi')">
        <template v-slot="{ uid }">
          <p :id="uid">{{ value.sanallinenItsearviointi }}</p>
        </template>
      </elsa-form-group>
      <div class="text-right">
        <b-button
          type="submit"
          variant="primary"
          :to="{
            name: 'itsearviointi',
            params: { arviointiId: value.id }
          }"
          >{{ $t("muokkaa-itsearviointia") }}</b-button
        >
      </div>
    </div>
    <b-form-row v-if="editing">
      <elsa-form-group
        :label="$t('vaativuustaso')"
        :required="true"
        class="col-lg-6"
      >
        <template v-slot:modal-content>
          <tyoskentelyjakso-form />
        </template>
        <template v-slot="{ uid }">
          <elsa-multiselect
            :id="uid"
            v-model="form.vaativuustaso"
            :options="vaativuustasot"
            track-by="arvo"
          >
            <template slot="singleLabel" slot-scope="{ option }">
              <span class="font-weight-700">{{ option.arvo }}</span>
              {{ $t(option.kuvaus) }}
            </template>
            <template slot="option" slot-scope="{ option }">
              <span class="font-weight-700">{{ option.arvo }}</span>
              {{ $t(option.kuvaus) }}
            </template>
          </elsa-multiselect>
        </template>
      </elsa-form-group>
    </b-form-row>
    <b-form-row v-if="editing">
      <elsa-form-group
        :label="$t('luottamuksen-taso')"
        :required="true"
        class="col-lg-6"
      >
        <template v-slot="{ uid }">
          <elsa-multiselect
            :id="uid"
            v-model="form.luottamuksenTaso"
            :options="luottamuksenTasot"
            track-by="arvo"
          >
            <template slot="singleLabel" slot-scope="{ option }">
              <span class="font-weight-700">{{ option.arvo }}</span>
              {{ $t(option.kuvaus) }}
            </template>
            <template slot="option" slot-scope="{ option }">
              <span class="font-weight-700">{{ option.arvo }}</span>
              {{ $t(option.kuvaus) }}
            </template>
          </elsa-multiselect>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group
      :label="$t('sanallinen-arviointi')"
      :required="true"
      v-if="editing"
    >
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.sanallinenArviointi"
          rows="5"
        ></b-form-textarea>
      </template>
    </elsa-form-group>
    <div class="text-right" v-if="editing">
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
import { vaativuustasot, luottamuksenTasot } from "@/utils/constants";
import store from "@/store";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaMultiselect from "@/components/multiselect/multiselect.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import ElsaLuottamuksenTaso from "@/components/luottamuksen-taso/luottamuksen-taso.vue";

@Component({
  components: {
    ElsaFormGroup,
    ElsaMultiselect,
    TyoskentelyjaksoForm,
    UserAvatar,
    ElsaLuottamuksenTaso
  }
})
export default class ArviointiForm extends Vue {
  @Prop({ required: false, default: false })
  editing!: boolean;

  @Prop({ required: true })
  value!: any;

  form: any = {
    vaativuustaso: null,
    luottamuksenTaso: null,
    sanallinenArviointi: null
  };
  vaativuustasot = vaativuustasot;
  luottamuksenTasot = luottamuksenTasot;

  onSubmit() {
    console.log("onSubmit", this.form);
    this.$emit("submit", this.form);
  }

  get displayName() {
    const account = store.getters.account;
    if (account) {
      return `${account.firstName} ${account.lastName}`;
    } else {
      return "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";

::v-deep table {
  thead th {
    border: none;
  }
  th:first-child {
    padding-left: 0;
    border-left: none;
  }
  th:last-child {
    padding-right: 0;
    border-right: none;
  }
  tbody td,
  tbody th {
    vertical-align: middle;
  }
  tbody th {
    font-weight: $font-weight-500;
  }
  tbody td:first-child {
    padding-left: 0;
  }
  tbody td:last-child {
    padding-right: 0;
    border-right: none;
  }
}
</style>
