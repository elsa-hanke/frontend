<template>
  <b-navbar
    id="navbar-top"
    toggleable="lg"
    type="dark"
    variant="primary"
    sticky
    class="px-0"
  >
    <b-navbar-brand class="col-lg-2 mr-0 text-nowrap user-select-none">
      <span class="font-weight-bold text-uppercase">{{ $t("elsa") }}</span
      >-{{ $t("palvelu") | lowercase }}
    </b-navbar-brand>

    <!--
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    -->

    <!--
    <div class="d-flex justify-content-center w-100">
      <div class="input-group" style="width: 500px;">
        <input
          class="form-control text-center rounded-pill"
          type="text"
          :placeholder="$t('etsi')"
          :aria-label="$t('etsi')"
        />
      </div>
    </div>
    -->

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav
        class="ml-auto mr-lg-3 d-none d-lg-flex d-xl-flex font-weight-500"
      >
        <b-nav-item
          href="#"
          class="text-nowrap align-self-center"
          :to="{ name: 'viestit' }"
        >
          <font-awesome-icon icon="envelope" fixed-width size="lg" />
          {{ $t("viestit") }}
        </b-nav-item>

        <b-nav-item
          href="#"
          class="border-left text-nowrap align-self-center"
          @click="logout()"
        >
          <user-avatar :displayName="displayName" />
        </b-nav-item>

        <b-nav-item-dropdown
          :text="$t(currentLocale)"
          class="border-left align-self-center"
          right
        >
          <b-dropdown-item
            @click="changeLocale(locale)"
            v-for="locale in locales"
            :key="locale"
            :disabled="currentLocale === locale"
            >{{ $t(locale) }}</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Avatar from "vue-avatar";
import store from "@/store";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";

@Component({
  components: {
    Avatar,
    UserAvatar
  }
})
export default class Navbar extends Vue {
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

  get locales() {
    return Object.keys(this.$i18n.messages);
  }

  async logout() {
    await store.dispatch("logout");
  }

  changeLocale(lang: string) {
    this.$i18n.locale = lang;
  }
}
</script>

<style lang="scss" scoped></style>
