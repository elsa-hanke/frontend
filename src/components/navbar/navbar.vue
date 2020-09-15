<template>
  <b-navbar toggleable="lg" type="dark" variant="primary" sticky class="px-0">
    <b-navbar-brand class="col-lg-2 mr-0 text-nowrap" :to="{ name: 'etusivu' }">
      <span class="font-weight-bold text-uppercase">{{ $t("elsa") }}</span
      >-{{ $t("palvelu") | lowercase }}
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

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

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto mr-lg-3">
        <b-nav-item
          href="#"
          class="text-nowrap align-self-center"
          :to="{ name: 'viestit' }"
        >
          {{ $t("viestit") }}
          <font-awesome-icon icon="envelope" fixed-width />
        </b-nav-item>

        <b-nav-item href="#" class="border-left text-nowrap align-self-center">
          <avatar
            username="Matti Meikäläinen"
            background-color="gray"
            color="white"
            :size="32"
            class="d-inline-block mr-3"
          ></avatar>
          <span>Matti Meikäläinen</span>
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

@Component({
  components: {
    avatar: Avatar
  }
})
export default class Navbar extends Vue {
  get currentLocale() {
    return this.$i18n.locale;
  }

  get locales() {
    return Object.keys(this.$i18n.messages);
  }

  changeLocale(lang: string) {
    this.$i18n.locale = lang;
  }
}
</script>

<style lang="scss" scoped></style>
