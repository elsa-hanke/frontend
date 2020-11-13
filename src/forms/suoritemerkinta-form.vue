<template>
  <b-form @submit.stop.prevent="onSubmit">
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
        <elsa-form-multiselect
          :id="uid"
          v-model="value.tyoskentelyjakso"
          :options="tyoskentelyjaksot"
          :state="validateState('tyoskentelyjakso')"
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
    <elsa-form-group :label="$t('oppimistavoite')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="value.oppimistavoite"
          :options="[]"
          :state="validateState('oppimistavoite')"
          label="nimi"
          track-by="id"
        >
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
          :state="validateState('lisatiedot')"
          rows="5"
        ></b-form-textarea>
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
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
import Component from "vue-class-component";
import axios from "axios";
import { Mixins, Prop } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { vaativuustasot, luottamuksenTasot } from "@/utils/constants";
import { toastSuccess, toastFail } from "@/utils/toast";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import ElsaPopover from "@/components/popover/popover.vue";
import ElsaFormDatepicker from "@/components/datepicker/datepicker.vue";

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
      },
      lisatiedot: {
        required
      }
    }
  }
})
export default class SuoritemerkintaForm extends Mixins(validationMixin) {
  @Prop({ required: false, default: [] })
  tyoskentelyjaksot!: any[];

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

  vaativuustasot = vaativuustasot;
  luottamuksenTasot = luottamuksenTasot;

  validateState(name: string) {
    const { $dirty, $error } = this.$v.value[name] as any;
    return $dirty ? ($error ? false : null) : null;
  }

  onSubmit() {
    this.$v.value.$touch();
    if (this.$v.value.$anyError) {
      return;
    }
    this.$emit("submit", this.value);
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
