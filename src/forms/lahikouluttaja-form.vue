<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('lahikouluttajan-nimi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input :id="uid" v-model="form.nimi"></b-form-input>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('lahikouluttajan-sahkoposti')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input :id="uid" v-model="form.sahkoposti" type="email" />
      </template>
    </elsa-form-group>
  </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ElsaFormGroup from "@/components/form-group/form-group.vue";

@Component({
  components: {
    ElsaFormGroup
  }
})
export default class LahikouluttajaForm extends Vue {
  form = {
    nimi: null,
    sahkoposti: null
  };

  onSubmit() {
    console.log("onSubmit", this.form);
  }
}
</script>
