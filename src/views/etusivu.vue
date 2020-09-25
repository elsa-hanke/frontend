<template>
  <div class="home">
    <b-container fluid>
      <b-row class="mt-4" lg>
        <b-col class="pl-0 pr-2">
          <b-card-skeleton
            :header="$t('henkilotiedot')"
            :loading="!account"
            class="mb-3"
          >
            <div class="d-flex align-items-center">
              <div>
                <avatar
                  :username="displayName"
                  background-color="gray"
                  color="white"
                  :size="96"
                  class="mr-3"
                ></avatar>
              </div>
              <div class="flex-fill">
                <table class="table table-borderless">
                  <tr>
                    <td class="p-0 text-muted">{{ $t("nimi") }}</td>
                    <td class="p-0">{{ displayName }}</td>
                  </tr>
                  <tr>
                    <td class="p-0 text-muted">{{ $t("puhelinnumero") }}</td>
                    <td class="p-0">-</td>
                  </tr>
                  <tr>
                    <td class="p-0 text-muted">{{ $t("erikoistumisala") }}</td>
                    <td class="p-0">-</td>
                  </tr>
                  <tr>
                    <td class="p-0 text-muted">{{ $t("vastuuhenkilo") }}</td>
                    <td class="p-0">-</td>
                  </tr>
                </table>
              </div>
              <b-button size="sm" variant="primary" class="rounded-pill">{{
                $t("muokkaa-tietoja")
              }}</b-button>
            </div>
          </b-card-skeleton>
          <b-card-skeleton
            :header="$t('suorittanut-erikoistumiseen-vaadittavista-opinnoista')"
            :loading="true"
            class="mb-3"
          ></b-card-skeleton>
          <b-card-skeleton
            :header="$t('tyoskentelyjaksot')"
            :loading="true"
            class="mb-3"
          ></b-card-skeleton>
        </b-col>
        <b-col class="pl-2 pr-0" lg>
          <b-card-skeleton
            :header="$t('koulutussuunnitelma')"
            :loading="true"
            class="mb-3"
          ></b-card-skeleton>
          <b-card-skeleton
            :header="$t('teoriakoulutukset')"
            :loading="true"
            class="mb-3"
          ></b-card-skeleton>
          <b-card-skeleton
            :header="$t('johtamiskoulutukset')"
            :loading="true"
            class="mb-3"
          ></b-card-skeleton>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2">
          <b-button
            variant="link"
            class="d-flex align-items-center text-decoration-none"
          >
            <div class="fa-2x mr-2">
              <font-awesome-layers>
                <font-awesome-icon icon="circle" />
                <font-awesome-icon
                  icon="arrows-alt"
                  transform="shrink-6"
                  :style="{ color: 'white' }"
                />
              </font-awesome-layers>
            </div>
            <span class="text-left">{{ $t("lisaa-ja-muokkaa-osioita") }}</span>
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BCardSkeleton from "@/components/card/card.vue";
import Avatar from "vue-avatar";
import store from "@/store";

@Component({
  components: {
    "b-card-skeleton": BCardSkeleton,
    avatar: Avatar
  }
})
export default class Etusivu extends Vue {
  get account() {
    return store.getters.account;
  }

  get displayName() {
    if (this.account) {
      return `${this.account.firstName} ${this.account.lastName}`;
    }
    return "";
  }
}
</script>
