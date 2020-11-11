<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('lahikouluttajan-nimi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.nimi"
          :state="validateState('nimi')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('lahikouluttajan-sahkoposti')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.sahkoposti"
          :state="validateState('sahkoposti')"
        />
        <b-form-invalid-feedback :id="`${uid}-feedback`">{{
          $t("pakollinen-tieto")
        }}</b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <b-button
        type="reset"
        variant="back"
        @click.stop.prevent="onCancelClick"
        >{{ $t("peruuta") }}</b-button
      >
      <b-button type="submit" variant="primary" class="ml-2">{{
        $t("lisaa")
      }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import ElsaFormGroup from "@/components/form-group/form-group.vue";

@Component({
  components: {
    ElsaFormGroup
  },
  validations: {
    value: {
      nimi: {
        required
      },
      sahkoposti: {
        required,
        email
      }
    }
  }
})
export default class LahikouluttajaForm extends Mixins(validationMixin) {
  value = {
    nimi: null,
    sahkoposti: null
  };

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

  onCancelClick() {
    this.$emit("cancel");
  }
}
</script>
