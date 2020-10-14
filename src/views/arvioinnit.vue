<template>
  <div class="arvioinnit">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="pl-0 pl-lg-3 pr-0" lg="2" order-lg="2" order-xl="2">
          <b-button
            variant="link"
            class="d-flex align-items-center text-decoration-none"
            :to="{ name: 'arviointipyynto' }"
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
            <span class="text-left">{{ $t("pyyda-arviointia") }}</span>
          </b-button>
          <!--
          <b-button
            variant="link"
            class="d-flex align-items-center text-decoration-none"
            :to="{ name: 'itsearviointi' }"
          >
            <div class="fa-2x mr-2">
              <font-awesome-layers>
                <font-awesome-icon icon="clipboard-list" />
              </font-awesome-layers>
            </div>
            <span class="text-left">{{ $t("tee-itsearviointi") }}</span>
          </b-button>
          -->
        </b-col>
        <b-col class="pl-0 pr-0 mt-3 mt-lg-0 mt-xl-0">
          <b-card-skeleton :loading="false" class="mb-3">
            <template v-slot:header>
              <div class="d-flex justify-content-between align-items-center">
                <span class="font-weight-500">{{ $t("arvioinnit") }}</span>
                <font-awesome-icon
                  icon="question-circle"
                  fixed-width
                  v-b-popover.hover.top="$t('arvioinnit-kuvaus')"
                /></div
            ></template>
            <b-container fluid class="px-0 mb-3">
              <b-row>
                <b-col>
                  <b-form-group
                    :label="$t('epa-osaamisalue')"
                    label-for="arvioinnit-osaamisalue-filter"
                  >
                    <b-form-select
                      id="arvioinnit-osaamisalue-filter"
                      v-model="selected.osaamisalue"
                      :options="options.osaamisalue"
                      ><template v-slot:first>
                        <b-form-select-option :value="null" disabled>{{
                          $t("valitse")
                        }}</b-form-select-option>
                      </template></b-form-select
                    >
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group
                    :label="$t('tapahtuma')"
                    label-for="arvioinnit-arviointi-filter"
                  >
                    <b-form-select
                      id="arvioinnit-arviointi-filter"
                      v-model="selected.arviointi"
                      :options="options.arviointi"
                      ><template v-slot:first>
                        <b-form-select-option :value="null" disabled>{{
                          $t("valitse")
                        }}</b-form-select-option>
                      </template></b-form-select
                    >
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group
                    :label="$t('tyoskentelyjakso')"
                    label-for="arvioinnit-tyoskentelyjakso-filter"
                  >
                    <b-form-select
                      id="arvioinnit-tyoskentelyjakso-filter"
                      v-model="selected.tyoskentelyjakso"
                      :options="options.tyoskentelyjakso"
                      ><template v-slot:first>
                        <b-form-select-option :value="null" disabled>{{
                          $t("valitse")
                        }}</b-form-select-option>
                      </template></b-form-select
                    >
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group
                    :label="$t('kouluttaja')"
                    label-for="arvioinnit-kouluttaja-filter"
                  >
                    <b-form-select
                      id="arvioinnit-kouluttaja-filter"
                      v-model="selected.kouluttaja"
                      :options="options.kouluttaja"
                      ><template v-slot:first>
                        <b-form-select-option :value="null" disabled>{{
                          $t("valitse")
                        }}</b-form-select-option>
                      </template></b-form-select
                    >
                  </b-form-group>
                </b-col>
              </b-row>
            </b-container>
            <b-skeleton width="85%"></b-skeleton>
            <b-skeleton width="55%"></b-skeleton>
            <b-skeleton width="70%"></b-skeleton>
          </b-card-skeleton>
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
    BCardSkeleton
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
    osaamisalue: [],
    arviointi: [],
    tyoskentelyjakso: [],
    kouluttaja: []
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
