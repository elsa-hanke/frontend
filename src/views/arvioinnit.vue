<template>
  <div class="arvioinnit">
    <b-container fluid>
      <b-row class="mt-4" lg>
        <b-col class="pl-0 pr-0">
          <b-card-skeleton
            :header="$t('Arvioinnit')"
            :loading="false"
            class="mb-3"
          >
            <b-container fluid class="px-0 mb-3">
              <b-row>
                <b-col>
                  <b-form-select
                    v-model="selected.osaamisalue"
                    :options="options.osaamisalue"
                  ></b-form-select>
                </b-col>
                <b-col>
                  <b-form-select
                    v-model="selected.arviointi"
                    :options="options.arviointi"
                  ></b-form-select>
                </b-col>
                <b-col>
                  <b-form-select
                    v-model="selected.tyoskentelyjakso"
                    :options="options.tyoskentelyjakso"
                  ></b-form-select>
                </b-col>
                <b-col>
                  <b-form-select
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
                <font-awesome-icon icon="clipboard-list" />
              </font-awesome-layers>
            </div>
            <span class="text-left">{{ $t("tee-itsearviointi") }}</span>
          </b-button>
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
    osaamisalue: [{ value: null, text: this.$t("epa-osaamisalue") }],
    arviointi: [{ value: null, text: this.$t("arviointi") }],
    tyoskentelyjakso: [{ value: null, text: this.$t("tyoskentelyjakso") }],
    kouluttaja: [{ value: null, text: this.$t("kouluttaja") }]
  };
}
</script>
