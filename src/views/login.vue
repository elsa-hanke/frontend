<template>
  <b-container
    class="d-flex flex-column justify-content-center align-items-center vh-100"
  >
    <b-card class="w-50">
      <template v-slot:header>
        <h1 class="text-white m-0">
          <span class="font-weight-bold text-uppercase">{{ $t("elsa") }}</span
          >-{{ $t("palvelu") | lowercase }}
        </h1>
      </template>
      <b-alert :show="error" variant="danger">{{
        $t("kirjautuminen-epaonnistui")
      }}</b-alert>
      <b-form @submit="onSubmit">
        <h2 class="h3 mb-3 font-weight-normal">{{ $t("kirjaudu-sisaan") }}</h2>
        <b-form-group
          id="input-group-1"
          :label="`${$t('kayttajatunnus')}:`"
          label-for="input-username"
        >
          <b-form-input
            id="input-username"
            v-model="form.username"
            type="text"
            required
            autocomplete="username"
            :placeholder="$t('syota-kayttajatunnus')"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-2"
          :label="`${$t('salasana')}:`"
          label-for="input-password"
        >
          <b-form-input
            id="input-password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            :placeholder="$t('syota-salasana')"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary" class="w-100">{{
          $t("kirjaudu")
        }}</b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";

@Component({
  components: {}
})
export default class Login extends Vue {
  form = {};
  error = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onSubmit(evt: any) {
    evt.preventDefault();
    await store.dispatch("login", this.form);
    await store.dispatch("authorize");
    if (store.getters.isLoggedIn) {
      this.$router.push({ name: "root" });
    } else {
      console.log("error");
      this.error = true;
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 2rem;
}
</style>
