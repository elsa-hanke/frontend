<template>
  <div class="arvioinnit">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row class="" lg>
        <b-col class="pl-0 pr-0">
          <b-card-skeleton :loading="false" class="mb-3">
            <template v-slot:header>
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ $t("arvioinnit") }}</span>
                <font-awesome-icon
                  icon="question-circle"
                  fixed-width
                  v-b-popover.hover.top="$t('arvioinnit-kuvaus')"
                /></div
            ></template>
            <b-container fluid class="px-0 mb-3">
              <b-row>
                <b-col>
                  <label for="arvioinnit-osaamisalue-filter">{{
                    $t("epa-osaamisalue")
                  }}</label>
                  <b-form-select
                    id="arvioinnit-osaamisalue-filter"
                    v-model="selected.osaamisalue"
                    :options="options.osaamisalue"
                  ></b-form-select>
                </b-col>
                <b-col>
                  <label for="arvioinnit-arviointi-filter">{{
                    $t("tapahtuma")
                  }}</label>
                  <b-form-select
                    id="arvioinnit-arviointi-filter"
                    v-model="selected.arviointi"
                    :options="options.arviointi"
                  ></b-form-select>
                </b-col>
                <b-col>
                  <label for="arvioinnit-tyoskentelyjakso-filter">{{
                    $t("tyoskentelyjakso")
                  }}</label>
                  <b-form-select
                    id="arvioinnit-tyoskentelyjakso-filter"
                    v-model="selected.tyoskentelyjakso"
                    :options="options.tyoskentelyjakso"
                  ></b-form-select>
                </b-col>
                <b-col>
                  <label for="arvioinnit-kouluttaja-filter">{{
                    $t("kouluttaja")
                  }}</label>
                  <b-form-select
                    id="arvioinnit-kouluttaja-filter"
                    v-model="selected.kouluttaja"
                    :options="options.kouluttaja"
                  ></b-form-select>
                </b-col>
              </b-row>
            </b-container>
            <b-skeleton width="85%"></b-skeleton>
            <b-skeleton width="55%"></b-skeleton>
            <b-skeleton width="70%"></b-skeleton>
          </b-card-skeleton>
        </b-col>
        <b-col class="pl-0 pl-lg-3 pr-0" lg="2">
          <b-button
            variant="link"
            class="d-flex align-items-center text-decoration-none"
          >
            <div class="fa-2x mr-2">
              <font-awesome-layers>
                <font-awesome-icon icon="clipboard" />
                <font-awesome-icon
                  icon="share"
                  transform="down-2 shrink-10"
                  :style="{ color: 'white' }"
                />
              </font-awesome-layers>
            </div>
            <span class="text-left">{{ $t("pyyda-arviota") }}</span>
          </b-button>
          <b-button
            variant="link"
            class="d-flex align-items-center text-decoration-none"
          >
            <div class="fa-2x mr-2">
              <font-awesome-layers>
                <font-awesome-icon icon="clipboard-list" />
              </font-awesome-layers>
            </div>
            <span class="text-left">{{ $t("tee-itsearviointi") }}</span>
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BCardSkeleton from "@/components/card/card.vue";

@Component({
  components: {
    "b-card-skeleton": BCardSkeleton
  }
})
export default class Arvioinnit extends Vue {
  selected = {
    osaamisalue: null,
    arviointi: null,
    tyoskentelyjakso: null,
    kouluttaja: null
  };

  options = {
    osaamisalue: [{ value: null, text: this.$t("valitse") }],
    arviointi: [{ value: null, text: this.$t("valitse") }],
    tyoskentelyjakso: [{ value: null, text: this.$t("valitse") }],
    kouluttaja: [{ value: null, text: this.$t("valitse") }]
  };

  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("arvioinnit"),
      active: true
    }
  ];
}
</script>
