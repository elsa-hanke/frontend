<template>
  <div class="arvioinnit">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("arvioinnit") }}</h1>
          <p>{{ $t("arvioinnit-kuvaus") }}</p>
          <elsa-button
            variant="primary"
            :to="{ name: 'arviointipyynto' }"
            class="mb-4"
            >{{ $t("pyyda-arviointia") }}</elsa-button
          >
          <b-tabs content-class="mt-3" :no-fade="true" @input="onTabChange">
            <b-tab :title="$t('arvioinnit-ja-itsearvioinnit')" active>
              <b-container fluid class="px-0">
                <b-row>
                  <b-col md="4">
                    <elsa-form-group
                      :label="$t('tyoskentelyjakso')"
                      label-for="arvioinnit-tyoskentelyjakso-filter"
                      class="mb-md-0"
                    >
                      <template v-slot="{ uid }">
                        <elsa-form-multiselect
                          :id="uid"
                          v-model="selected.tyoskentelyjakso"
                          :options="tyoskentelyjaksotFormatted"
                          label="label"
                          track-by="id"
                          @select="onTyoskentelyjaksoSelect"
                          @remove="onTyoskentelyjaksoRemove"
                        >
                        </elsa-form-multiselect>
                      </template>
                    </elsa-form-group>
                  </b-col>
                  <b-col md="4">
                    <elsa-form-group
                      :label="$t('epa-osaamisalue')"
                      class="mb-md-0"
                    >
                      <template v-slot="{ uid }">
                        <elsa-form-multiselect
                          :id="uid"
                          v-model="selected.epaOsaamisalue"
                          :options="options.epaOsaamisalueet"
                          label="nimi"
                          track-by="id"
                          @select="onEpaOsaamisalueSelect"
                          @remove="onEpaOsaamisalueRemove"
                        >
                        </elsa-form-multiselect>
                      </template>
                    </elsa-form-group>
                  </b-col>
                  <b-col md="4">
                    <elsa-form-group
                      :label="$t('kouluttaja')"
                      label-for="arvioinnit-kouluttaja-filter"
                      class="mb-0"
                    >
                      <template v-slot="{ uid }">
                        <elsa-form-multiselect
                          :id="uid"
                          v-model="selected.kouluttaja"
                          :options="options.kouluttajat"
                          label="nimi"
                          track-by="id"
                          @select="onKouluttajaSelect"
                          @remove="onKouluttajaRemove"
                        >
                        </elsa-form-multiselect>
                      </template>
                    </elsa-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="d-flex flex-row-reverse">
                      <elsa-button
                        :disabled="false"
                        variant="link"
                        @click="resetFilters"
                        class="shadow-none"
                        >{{ $t("tyhjenna-valinnat") }}</elsa-button
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
                    <font-awesome-icon
                      icon="info-circle"
                      fixed-width
                      class="text-muted"
                    />
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
                  <b-spinner variant="primary" :label="$t('ladataan')" />
                </div>
              </div>
            </b-tab>
            <b-tab :title="$t('arviointipyynnot')">
              <div v-if="pyynnot">
                <div v-for="(arviointipyynto, index) in pyynnot" :key="index">
                  <arviointipyynto-card :value="arviointipyynto" />
                </div>
                <b-alert v-if="pyynnot.length === 0" variant="dark" show>
                  <font-awesome-icon
                    icon="info-circle"
                    fixed-width
                    class="text-muted"
                  />
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
                <b-spinner variant="primary" :label="$t('ladataan')" />
              </div>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import ArviointiCard from "@/components/arviointi-card/arviointi-card.vue";
import ArviointipyyntoCard from "@/components/arviointipyynto-card/arviointipyynto-card.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import ElsaButton from "@/components/button/button.vue";
import { tyoskentelyjaksoLabel } from "@/utils/tyoskentelyjakso";

@Component({
  components: {
    ArviointiCard,
    ArviointipyyntoCard,
    ElsaFormGroup,
    ElsaFormMultiselect,
    ElsaButton
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
  } as any;
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
    this.fetch();
  }

  onTabChange(value: any) {
    this.selected = {
      tyoskentelyjakso: null,
      epaOsaamisalue: null,
      kouluttaja: null
    };
    this.omat = null;
    this.page = 1;
    this.totalRows = 0;
    if (value === 0) {
      this.fetch();
    } else if (value === 1) {
      // Hetaan arviointipyynnöt pelkästään
      this.fetch({
        "arviointiAika.specified": false
      });
    }
  }

  onTyoskentelyjaksoSelect(selected: any) {
    this.selected.tyoskentelyjakso = selected;
    this.page = 1;
    this.fetch();
  }

  onTyoskentelyjaksoRemove() {
    this.selected.tyoskentelyjakso = null;
    this.page = 1;
    this.fetch();
  }

  onEpaOsaamisalueSelect(selected: any) {
    this.selected.epaOsaamisalue = selected;
    this.page = 1;
    this.fetch();
  }

  onEpaOsaamisalueRemove() {
    this.selected.epaOsaamisalue = null;
    this.page = 1;
    this.fetch();
  }

  onKouluttajaSelect(selected: any) {
    this.selected.kouluttaja = selected;
    this.page = 1;
    this.fetch();
  }

  onKouluttajaRemove() {
    this.selected.kouluttaja = null;
    this.page = 1;
    this.fetch();
  }

  async fetchOptions() {
    this.options = (
      await axios.get("erikoistuva-laakari/suoritusarvioinnit-rajaimet")
    ).data;
  }

  async fetch(options: any = {}) {
    try {
      const omat = await axios.get("erikoistuva-laakari/suoritusarvioinnit", {
        params: {
          ...options,
          page: this.page - 1,
          size: this.perPage,
          sort: "tapahtumanAjankohta,desc",
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

  get tyoskentelyjaksotFormatted() {
    return this.options.tyoskentelyjaksot.map((tj: any) => ({
      ...tj,
      label: tyoskentelyjaksoLabel(this, tj)
    }));
  }
}
</script>

<style lang="scss" scoped>
.arvioinnit {
  max-width: 1024px;
}

::v-deep .multiselect {
  .multiselect__option::after {
    display: none;
  }
}
</style>
