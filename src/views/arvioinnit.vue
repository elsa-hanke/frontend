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
        </b-col>
        <b-col class="px-0 mt-3 mt-lg-0 mt-xl-0">
          <b-card-skeleton :loading="false" class="mb-3">
            <template v-slot:header>
              <div class="d-flex justify-content-between align-items-center">
                <span class="font-weight-500">{{ $t("arvioinnit") }}</span>
                <font-awesome-icon
                  icon="question-circle"
                  fixed-width
                  v-b-popover.hover.top="$t('arvioinnit-kuvaus')"
                />
              </div>
            </template>
            <b-tabs content-class="mt-3" :no-fade="true" @input="onTabChange">
              <b-tab :title="$t('arvioinnit-ja-itsearvioinnit')" active>
                <b-container fluid class="px-0">
                  <b-row>
                    <b-col>
                      <elsa-form-group
                        :label="$t('tyoskentelyjakso')"
                        label-for="arvioinnit-tyoskentelyjakso-filter"
                        class="mb-0"
                      >
                        <template v-slot="{ uid }">
                          <elsa-multiselect
                            :id="uid"
                            v-model="selected.tyoskentelyjakso"
                            :options="options.tyoskentelyjaksot"
                            track-by="id"
                            @select="onTyoskentelyjaksoSelect"
                            @remove="onTyoskentelyjaksoRemove"
                          >
                            <template
                              slot="singleLabel"
                              slot-scope="{ option }"
                            >
                              {{ option.tyoskentelypaikka.nimi }} ({{
                                option.alkamispaiva
                              }}
                              –
                              {{
                                option.paattymispaiva
                                  ? option.paattymispaiva
                                  : $t("kesken") | lowercase
                              }})
                            </template>
                            <template slot="option" slot-scope="{ option }">
                              {{ option.tyoskentelypaikka.nimi }} ({{
                                option.alkamispaiva
                              }}
                              –
                              {{
                                option.paattymispaiva
                                  ? option.paattymispaiva
                                  : $t("kesken") | lowercase
                              }})
                            </template>
                          </elsa-multiselect>
                        </template>
                      </elsa-form-group>
                    </b-col>
                    <b-col>
                      <elsa-form-group
                        :label="$t('epa-osaamisalue')"
                        class="mb-0"
                      >
                        <template v-slot="{ uid }">
                          <elsa-multiselect
                            :id="uid"
                            v-model="selected.epaOsaamisalue"
                            :options="options.epaOsaamisalueet"
                            label="nimi"
                            track-by="id"
                            @select="onEpaOsaamisalueSelect"
                            @remove="onEpaOsaamisalueRemove"
                          >
                          </elsa-multiselect>
                        </template>
                      </elsa-form-group>
                    </b-col>
                    <b-col>
                      <elsa-form-group
                        :label="$t('kouluttaja')"
                        label-for="arvioinnit-kouluttaja-filter"
                        class="mb-0"
                      >
                        <template v-slot="{ uid }">
                          <elsa-multiselect
                            :id="uid"
                            v-model="selected.kouluttaja"
                            :options="options.kouluttajat"
                            label="nimi"
                            track-by="id"
                            @select="onKouluttajaSelect"
                            @remove="onKouluttajaRemove"
                          >
                          </elsa-multiselect>
                        </template>
                      </elsa-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <div class="d-flex flex-row-reverse">
                        <b-button
                          :disabled="false"
                          variant="link"
                          @click="resetFilters"
                          class="shadow-none"
                          >{{ $t("tyhjenna-valinnat") }}</b-button
                        >
                      </div>
                    </b-col>
                  </b-row>
                </b-container>
                <div class="arvioinnit">
                  <hr class="mt-0" />
                  <div v-if="arvioinnit">
                    <div v-for="(arviointi, index) in arvioinnit" :key="index">
                      <arviointi-card :value="arviointi" />
                    </div>
                    <b-alert v-if="arvioinnit.length === 0" variant="dark" show>
                      <font-awesome-layers fixed-width>
                        <font-awesome-icon :icon="['far', 'circle']" />
                        <font-awesome-icon icon="info" transform="shrink-8" />
                      </font-awesome-layers>
                      {{ $t("arviointeja-ei-ole-viela-tehty") }}
                    </b-alert>
                    <b-pagination
                      v-model="page"
                      :total-rows="totalRows"
                      :per-page="perPage"
                      @input="fetch"
                      pills
                      align="center"
                      :hide-goto-end-buttons="true"
                    >
                      <template v-slot:prev-text
                        ><font-awesome-icon
                          icon="chevron-left"
                          fixed-width
                          size="lg"
                          cl
                        />{{ $t("edellinen") }}</template
                      >
                      <template v-slot:next-text
                        >{{ $t("seuraava")
                        }}<font-awesome-icon
                          icon="chevron-right"
                          fixed-width
                          size="lg"
                      /></template>
                    </b-pagination>
                  </div>
                  <div class="text-center" v-else>
                    <b-spinner variant="primary" label="Spinning"></b-spinner>
                  </div>
                </div>
              </b-tab>
              <b-tab :title="$t('arviointipyynnot')">
                <div v-if="pyynnot">
                  <div v-for="(arviointipyynto, index) in pyynnot" :key="index">
                    <arviointipyynto-card :value="arviointipyynto" />
                  </div>
                  <b-alert v-if="pyynnot.length === 0" variant="dark" show>
                    <font-awesome-layers fixed-width>
                      <font-awesome-icon :icon="['far', 'circle']" />
                      <font-awesome-icon icon="info" transform="shrink-8" />
                    </font-awesome-layers>
                    {{ $t("kaikkiin-arviointipyyntoihisi-on-tehty-arviointi") }}
                  </b-alert>
                  <b-pagination
                    v-model="page"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    @input="fetch"
                    pills
                    align="center"
                    :hide-goto-end-buttons="true"
                  >
                    <template v-slot:prev-text
                      ><font-awesome-icon
                        icon="chevron-left"
                        fixed-width
                        size="lg"
                        cl
                      />{{ $t("edellinen") }}</template
                    >
                    <template v-slot:next-text
                      >{{ $t("seuraava")
                      }}<font-awesome-icon
                        icon="chevron-right"
                        fixed-width
                        size="lg"
                    /></template>
                  </b-pagination>
                </div>
                <div class="text-center" v-else>
                  <b-spinner variant="primary" label="Spinning"></b-spinner>
                </div>
              </b-tab>
            </b-tabs>
          </b-card-skeleton>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import BCardSkeleton from "@/components/card/card.vue";
import ArviointiCard from "@/components/arviointi-card/arviointi-card.vue";
import ArviointipyyntoCard from "@/components/arviointipyynto-card/arviointipyynto-card.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaMultiselect from "@/components/multiselect/multiselect.vue";

@Component({
  components: {
    BCardSkeleton,
    ArviointiCard,
    ArviointipyyntoCard,
    ElsaFormGroup,
    ElsaMultiselect
  }
})
export default class Arvioinnit extends Vue {
  selected = {
    tyoskentelyjakso: null,
    epaOsaamisalue: null,
    kouluttaja: null
  } as any;
  options = {
    tyoskentelyjaksot: [],
    epaOsaamisalueet: [],
    kouluttajat: []
  };
  omat: null | any[] = null;
  page = 1;
  totalRows = 0;
  perPage = 5;
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

  mounted() {
    this.fetchOptions();
  }

  resetFilters() {
    this.selected = {
      tyoskentelyjakso: null,
      epaOsaamisalue: null,
      kouluttaja: null
    };
    this.page = 1;
    this.fetch(false);
  }

  onTabChange(value: any) {
    this.omat = null;
    this.page = 1;
    this.totalRows = 0;
    if (value === 0) {
      this.fetch(false); // Arvioinnit
    } else if (value === 1) {
      this.fetch(true); // Arviointipyynnöt
    }
  }

  onTyoskentelyjaksoSelect(selected: any) {
    this.selected.tyoskentelyjakso = selected;
    this.page = 1;
    this.fetch(false);
  }

  onTyoskentelyjaksoRemove() {
    this.selected.tyoskentelyjakso = null;
    this.page = 1;
    this.fetch(false);
  }

  onEpaOsaamisalueSelect(selected: any) {
    this.selected.epaOsaamisalue = selected;
    this.page = 1;
    this.fetch(false);
  }

  onEpaOsaamisalueRemove() {
    this.selected.epaOsaamisalue = null;
    this.page = 1;
    this.fetch(false);
  }

  onKouluttajaSelect(selected: any) {
    this.selected.kouluttaja = selected;
    this.page = 1;
    this.fetch(false);
  }

  onKouluttajaRemove() {
    this.selected.kouluttaja = null;
    this.page = 1;
    this.fetch(false);
  }

  async fetchOptions() {
    this.options = (
      await axios.get("erikoistuva-laakari/suoritusarvioinnit-rajaimet")
    ).data;
  }

  async fetch(isArviointipyynto: boolean) {
    try {
      const omat = await axios.get("erikoistuva-laakari/suoritusarvioinnit", {
        params: {
          "arviointiAika.specified": !isArviointipyynto,
          page: this.page - 1,
          size: this.perPage,
          "tyoskentelyjaksoId.equals": this.selected.tyoskentelyjakso?.id,
          "arvioitavaOsaalueId.equals": this.selected.epaOsaamisalue?.id,
          "arvioinninAntajaId.equals": this.selected.kouluttaja?.id
        }
      });
      this.totalRows = omat.headers["x-total-count"];
      this.omat = omat.data.content;
    } catch (err) {
      this.omat = [];
    }
  }

  get arvioinnit() {
    if (this.omat) {
      return this.omat;
    }
    return null;
  }

  get pyynnot() {
    if (this.omat) {
      return this.omat;
    }
    return null;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .multiselect {
  .multiselect__option::after {
    display: none;
  }
}
</style>
