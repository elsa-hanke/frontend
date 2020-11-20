<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group
      :label="$t('erikoistuva-laakari')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <user-avatar :id="uid" :displayName="value.arvioinninSaaja.nimi" />
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
        <div :id="uid">
          {{ value.arvioitavaOsaalue.nimi }}
          <elsa-popover>
            <template>
              <h2>{{ value.arvioitavaOsaalue.nimi }}</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </template>
          </elsa-popover>
        </div>
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
      v-if="value.lisatiedot"
      :label="$t('lisatiedot')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid" class="text-prewrap">{{ value.lisatiedot }}</span>
      </template>
    </elsa-form-group>
    <div v-if="!editing">
      <b-table-simple responsive bordered>
        <thead>
          <tr>
            <th scope="col" style="width: 24%;"></th>
            <th scope="col" style="width: 38%;">{{ $t("arviointi") }}</th>
            <th scope="col" style="width: 38%;">
              {{ $t("itsearviointi") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              {{ $t("luottamuksen-taso") }}
              <elsa-popover>
                <template>
                  <h2>{{ $t("luottamuksen-taso") }}</h2>
                  <div v-for="(taso, index) in luottamuksenTasot" :key="index">
                    <h3>{{ taso.arvo }} {{ $t(taso.nimi) }}</h3>
                    <p>{{ $t(taso.kuvaus) }}</p>
                  </div>
                </template>
              </elsa-popover>
            </th>
            <td>
              <div v-if="!value.arviointiAika" class="text-size-sm text-muted">
                {{ $t("arviointia-ei-ole-viela-annettu") }}
              </div>
              <elsa-luottamuksen-taso
                v-if="value.arviointiAika"
                :value="value.luottamuksenTaso"
              />
            </td>
            <td>
              <div v-if="!value.itsearviointiAika" class="d-inline-flex">
                <elsa-button
                  variant="primary"
                  class="d-flex align-items-center text-decoration-none"
                  :to="{
                    name: 'itsearviointi',
                    params: { arviointiId: value.id }
                  }"
                >
                  {{ $t("tee-itsearviointi") }}
                </elsa-button>
              </div>
              <elsa-luottamuksen-taso
                v-if="value.itsearviointiAika"
                :value="value.itsearviointiLuottamuksenTaso"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">
              {{ $t("vaativuustaso") }}
              <elsa-popover>
                <template>
                  <h2>{{ $t("vaativuustaso") }}</h2>
                  <div v-for="(taso, index) in vaativuustasot" :key="index">
                    <h3>{{ taso.arvo }} {{ $t(taso.nimi) }}</h3>
                    <p>{{ $t(taso.kuvaus) }}</p>
                  </div>
                </template>
              </elsa-popover>
            </th>
            <td>
              <elsa-badge
                v-if="value.vaativuustaso"
                :value="value.vaativuustaso"
              />
            </td>
            <td>
              <elsa-badge
                v-if="value.itsearviointiAika"
                :value="value.itsearviointiVaativuustaso"
              />
            </td>
          </tr>
        </tbody>
      </b-table-simple>
      <elsa-form-group
        v-if="value.arviointiAika"
        :label="$t('sanallinen-arviointi')"
      >
        <template v-slot="{ uid }">
          <p :id="uid" class="text-prewrap">{{ value.sanallinenArviointi }}</p>
        </template>
      </elsa-form-group>
      <elsa-form-group
        v-if="value.itsearviointiAika"
        :label="$t('sanallinen-itsearviointi')"
      >
        <template v-slot="{ uid }">
          <p :id="uid" class="text-prewrap">
            {{ value.sanallinenItsearviointi }}
          </p>
        </template>
      </elsa-form-group>
      <div
        v-if="!value.arviointiAika && value.itsearviointiAika"
        class="text-right"
      >
        <elsa-button
          variant="primary"
          :to="{
            name: 'itsearviointi',
            params: { arviointiId: value.id }
          }"
          >{{ $t("muokkaa-itsearviointia") }}</elsa-button
        >
      </div>
    </div>
    <div v-else>
      <hr />
      <b-form-row>
        <elsa-form-group
          :label="$t('luottamuksen-taso')"
          :required="true"
          class="col-lg-6"
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
              v-model="form.luottamuksenTaso"
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
      </b-form-row>
      <b-form-row>
        <elsa-form-group
          :label="$t('vaativuustaso')"
          :required="true"
          class="col-lg-6"
        >
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
              v-model="form.vaativuustaso"
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
      </b-form-row>
      <elsa-form-group
        :label="$t('sanallinen-arviointi')"
        :required="true"
        v-if="editing"
      >
        <template v-slot="{ uid }">
          <div v-if="itsearviointi">
            <p class="mb-2">
              {{ $t("sanallinen-itsearviointi-osa-alueittan") }}
            </p>
            <p class="mb-2">{{ $t("sanallinen-itsearviointi-suhteet") }}</p>
            <p class="mb-2">
              {{ $t("sanallinen-itsearviointi-muu-osaaminen") }}
            </p>
            <p class="mb-2">{{ $t("sanallinen-itsearviointi-tavoitteet") }}</p>
          </div>
          <b-form-textarea
            :id="uid"
            v-model="form.sanallinenArviointi"
            :state="validateState('sanallinenArviointi')"
            rows="5"
          ></b-form-textarea>
          <b-form-invalid-feedback :id="`${uid}-feedback`">{{
            $t("pakollinen-tieto")
          }}</b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <div class="text-right">
        <elsa-button type="reset" variant="back" :to="{ name: 'arvioinnit' }">{{
          $t("peruuta")
        }}</elsa-button>
        <elsa-button
          :loading="params.saving"
          type="submit"
          variant="primary"
          class="ml-2"
          >{{ $t("laheta") }}</elsa-button
        >
      </div>
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins, Prop } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import ElsaLuottamuksenTaso from "@/components/luottamuksen-taso/luottamuksen-taso.vue";
import ElsaBadge from "@/components/badge/badge.vue";
import ElsaPopover from "@/components/popover/popover.vue";
import ElsaButton from "@/components/button/button.vue";
import { vaativuustasot, luottamuksenTasot } from "@/utils/constants";

@Component({
  components: {
    ElsaFormGroup,
    ElsaFormMultiselect,
    TyoskentelyjaksoForm,
    UserAvatar,
    ElsaLuottamuksenTaso,
    ElsaBadge,
    ElsaPopover,
    ElsaButton
  },
  validations: {
    form: {
      vaativuustaso: {
        required
      },
      luottamuksenTaso: {
        required
      },
      sanallinenArviointi: {
        required
      }
    }
  }
})
export default class ArviointiForm extends Mixins(validationMixin) {
  @Prop({ required: false, default: false })
  editing!: boolean;

  @Prop({ required: true, type: Object })
  value!: any;

  @Prop({ required: false, default: false })
  itsearviointi!: boolean;

  // Joko arviointi tai itsearviointi
  form: any = {
    vaativuustaso: null,
    luottamuksenTaso: null,
    sanallinenArviointi: null
  };
  vaativuustasot = vaativuustasot;
  luottamuksenTasot = luottamuksenTasot;
  params = {
    saving: false
  };

  mounted() {
    if (this.itsearviointi) {
      this.form = {
        vaativuustaso: vaativuustasot.find(
          taso => taso.arvo === this.value.itsearviointiVaativuustaso
        ),
        luottamuksenTaso: luottamuksenTasot.find(
          taso => taso.arvo === this.value.itsearviointiLuottamuksenTaso
        ),
        sanallinenArviointi: this.value.sanallinenItsearviointi
      };
    } else {
      this.form = {
        vaativuustaso: vaativuustasot.find(
          taso => taso.arvo === this.value.vaativuustaso
        ),
        luottamuksenTaso: luottamuksenTasot.find(
          taso => taso.arvo === this.value.luottamuksenTaso
        ),
        sanallinenArviointi: this.value.sanallinenArviointi
      };
    }
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
    if (this.itsearviointi) {
      this.$emit(
        "submit",
        {
          ...this.value,
          itsearviointiVaativuustaso: this.form.vaativuustaso.arvo,
          itsearviointiLuottamuksenTaso: this.form.luottamuksenTaso.arvo,
          sanallinenItsearviointi: this.form.sanallinenArviointi
        },
        this.params
      );
    } else {
      this.$emit(
        "submit",
        {
          ...this.value,
          vaativuustaso: this.form.vaativuustaso.arvo,
          luottamuksenTaso: this.form.luottamuksenTaso.arvo,
          sanallinenArviointi: this.form.sanallinenArviointi
        },
        this.params
      );
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
