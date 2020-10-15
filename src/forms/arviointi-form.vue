<template>
  <b-form @submit="onSubmit">
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
        :id="arviointiVaativuustasoId"
        v-model="form.vaativuustaso"
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
    <div class="d-flex">
      <elsa-form-group
        :label-for="arviointiAmmatillisuusId"
        :label="$t('ammatillisuus')"
        :required="true"
      >
        <b-form-rating
          :id="arviointiAmmatillisuusId"
          inline
          no-border
          stars="5"
          :readonly="true"
          :value="data.item.arviointi"
          class="color-star p-0"
        />
      </elsa-form-group>
    </div>
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
export default class ArviointiForm extends Vue {
  form = {};
  vaativuustaso = [];

  onSubmit(event: any) {
    event.preventDefault();
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

  get uid() {
    return (this as any)._uid;
  }

  get arviointiVaativuustasoId() {
    return `arviointi-vaativuustaso-${this.uid}`;
  }

  get arviointiAmmatillisuusId() {
    return `arviointi-ammatillisuus-${this.uid}`;
  }
}
</script>

<style lang="scss" scoped></style>
