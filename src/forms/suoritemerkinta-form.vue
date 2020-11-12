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
    <elsa-form-group :label="$t('oppimistavoite')" :required="true">
      <template v-slot="{ uid }">
        <elsa-multiselect
          :id="uid"
          v-model="value.oppimistavoite"
          :options="[]"
          :state="validateState('oppimistavoite')"
          label="nimi"
          track-by="id"
        >
        </elsa-multiselect>
        <b-form-invalid-feedback
          :id="`${uid}-feedback`"
          :style="{
            display:
              validateState('oppimistavoite') === false ? 'block' : 'none'
          }"
          >{{ $t("pakollinen-tieto") }}</b-form-invalid-feedback
        >
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('vaativuustaso')" :required="true">
      <template v-slot="{ uid }">
        <elsa-multiselect
          :id="uid"
          v-model="value.vaativuustaso"
          :options="[]"
          :state="validateState('vaativuustaso')"
          label="nimi"
          track-by="id"
        >
        </elsa-multiselect>
        <b-form-invalid-feedback
          :id="`${uid}-feedback`"
          :style="{
            display: validateState('vaativuustaso') === false ? 'block' : 'none'
          }"
          >{{ $t("pakollinen-tieto") }}</b-form-invalid-feedback
        >
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('luottamuksen-taso')"
        :required="true"
        class="col-md-8"
      >
        <template v-slot="{ uid }">
          <elsa-multiselect
            :id="uid"
            v-model="value.luottamuksenTaso"
            :options="[]"
            :state="validateState('luottamuksenTaso')"
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
              display:
                validateState('luottamuksenTaso') === false ? 'block' : 'none'
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
            v-model="value.suorituspaiva"
            :state="validateState('suorituspaiva')"
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
      <b-button type="submit" variant="primary" class="ml-2">{{
        $t("laheta")
      }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaMultiselect from "@/components/multiselect/multiselect.vue";

@Component({
  components: {
    ElsaFormGroup,
    ElsaMultiselect
  }
})
export default class SuoritemerkintaForm extends Vue {
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
}
</script>
