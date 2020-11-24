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
        :header="$t('opintooikeuden-tarkistaminen')"
        class="mt-5 mb-3 kayttoikeus-card"
      >
        <section>
          <p>{{ $t("kayttooikeus-kuvaus") }}</p>
          <p>{{ $t("kayttooikeus-kuvaus-ohje") }}</p>
        </section>
        <hr />
        <kayttooikeus-form @submit="onSubmit" />
      </b-card-skeleton>
      <div
        class="d-flex justify-content-center align-items-center mt-5 mb-3"
        v-else
      >
        <b-spinner variant="primary" :label="$t('ladataan')" class="mr-3" />
        <span>{{ $t("lisataan-tiedot-kayttajalle") }}</span>
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import KayttooikeusForm from "@/forms/kayttooikeus-form.vue";
import BCardSkeleton from "@/components/card/card.vue";
import { toastSuccess, toastFail } from "@/utils/toast";

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
    this.loading = true;
    try {
      await axios.put(`erikoistuva-laakari/kayttooikeushakemus`, value);
      toastSuccess(this, this.$t("kayttooikeuden-lisaaminen-onnistui"));
      this.$router.push({ name: "etusivu" });
    } catch (err) {
      this.loading = false;
      toastFail(this, this.$t("kayttooikeuden-lisaaminen-epaonnistui"));
    }
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
