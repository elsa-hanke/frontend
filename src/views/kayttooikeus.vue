<template>
  <div class="kayttoikeus">
    <b-container>
      <div
        class="d-flex justify-content-center align-items-center pt-5 user-select-none"
      >
        <img
          :src="`${publicPath}img/icons/favicon.svg`"
          style="height: 100px;"
          class="mr-3"
          :alt="$t('elsa-palvelu')"
        />
        <h1 class="text-primary m-0">
          <span class="font-weight-bold text-uppercase">{{ $t("elsa") }}</span
          >-{{ $t("palvelu") | lowercase }}
        </h1>
      </div>
      <b-card-skeleton
        v-if="!loading"
        :loading="false"
        class="mt-5 mb-3 kayttoikeus-card"
      >
        <template v-slot:header>
          <div class="d-flex justify-content-between align-items-center">
            <span class="font-weight-500">{{ $t("käyttooikeushakemus") }}</span>
            <font-awesome-icon
              icon="question-circle"
              fixed-width
              v-b-popover.hover.top="$t('roolin-valinta-kuvaus')"
            />
          </div>
        </template>
        <kayttooikeus-form @submit="onSubmit" />
      </b-card-skeleton>
      <div
        class="d-flex justify-content-center align-items-center mt-5 mb-3"
        v-else
      >
        <b-spinner variant="primary" label="Spinning" class="mr-3"></b-spinner>
        <span>{{ $t("lisataan-tiedot-kayttajalle") }}</span>
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import KayttooikeusForm from "@/forms/kayttooikeus-form.vue";
import BCardSkeleton from "@/components/card/card.vue";

@Component({
  components: {
    KayttooikeusForm,
    BCardSkeleton
  }
})
export default class Kayttooikeus extends Vue {
  loading = false;
  publicPath = process.env.BASE_URL;

  async onSubmit(value: any) {
    console.log(value);
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";

.kayttoikeus {
  min-height: 100vh;
  background-color: $backdrop-background-color;
}
</style>
