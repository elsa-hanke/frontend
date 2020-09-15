<template>
  <div class="home">
    <b-container fluid>
      <b-row class="mt-4" lg>
        <b-col class="pl-0 pr-2">
          <b-card-skeleton
            :header="$t('henkilotiedot')"
            :loading="false"
            class="mb-3"
          >
            <div class="d-flex align-items-center">
              <avatar
                username="Matti Meikäläinen"
                background-color="gray"
                color="white"
                :size="96"
                class="d-inline-block mr-3"
              ></avatar>
              <div class="d-flex flex-column flex-fill">
                <b-skeleton width="65%"></b-skeleton>
                <b-skeleton width="55%"></b-skeleton>
                <b-skeleton width="70%"></b-skeleton>
                <b-skeleton width="60%"></b-skeleton>
              </div>
            </div>
          </b-card-skeleton>
          <b-card-skeleton
            :header="$t('suorittanut-erikoistumisen-vaadittavista-opinnoista')"
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
        <b-col sm="2">
          <b-button
            variant="link"
            class="d-flex align-items-center text-decoration-none"
          >
            <font-awesome-layers class="fa-2x mr-5">
              <font-awesome-icon icon="circle" />
              <font-awesome-icon
                icon="arrows-alt"
                transform="shrink-6"
                :style="{ color: 'white' }"
              />
            </font-awesome-layers>
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

@Component({
  components: {
    "b-card-skeleton": BCardSkeleton,
    avatar: Avatar
  }
})
export default class Etusivu extends Vue {}
</script>
