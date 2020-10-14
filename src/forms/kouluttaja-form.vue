<template>
  <b-form @submit="onSubmit">
    <b-form-group :label-for="kouluttajaNimiId"
      ><template v-slot:label
        ><div class="text-nowrap">
          {{ $t("kouluttajan-nimi") }}
          <span class="text-primary">*</span>
        </div></template
      ><b-form-input :id="kouluttajaNimiId" v-model="form.nimi"></b-form-input>
    </b-form-group>
    <b-form-group :label-for="kouluttajaSahkopostiId"
      ><template v-slot:label
        ><div class="text-nowrap">
          {{ $t("kouluttajan-sahkoposti") }}
          <span class="text-primary">*</span>
        </div></template
      ><b-form-input
        :id="kouluttajaSahkopostiId"
        v-model="form.sahkoposti"
      ></b-form-input>
    </b-form-group>
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
export default class KouluttajaForm extends Vue {
  form = {
    nimi: null,
    sahkoposti: null
  };

  onSubmit(event: any) {
    event.preventDefault();
    console.log("onSubmit", this.form);
  }

  get uid() {
    return (this as any)._uid;
  }

  get kouluttajaNimiId() {
    return `kouluttaja-nimi-${this.uid}`;
  }

  get kouluttajaSahkopostiId() {
    return `kouluttaja-sahkoposti-${this.uid}`;
  }
}
</script>

<style lang="scss" scoped></style>
