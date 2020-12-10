<template>
  <div class="tyoskentelyjaksot">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("tyoskentelyjaksot") }}</h1>
          <p>{{ $t("tyoskentelyjaksot-kuvaus") }}</p>
          <elsa-button
            variant="primary"
            :to="{ name: 'uusi-tyoskentelyjakso' }"
            class="mb-4 mr-2"
            >{{ $t("lisaa-tyoskentelyjakso") }}</elsa-button
          >
          <elsa-button
            variant="outline-primary"
            :to="{ name: 'uusi-poissaolo' }"
            class="mb-4"
            >{{ $t("lisaa-poissaolo") }}</elsa-button
          >
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <elsa-form-group :label="$t('tyoskentelyaika-erikoisalalla')">
                <template v-slot="{ uid }">
                  <div :id="uid" class="d-flex flex-wrap">
                    <div class="d-flex flex-column mb-2 duration-card">
                      <span class="duration-text">1 v 8 kk 11 pv</span>
                      <span class="text-size-sm">{{
                        $t("tyoskentelyaika-yhteensa")
                      }}</span>
                    </div>
                    <div class="d-flex flex-column mb-2 duration-card">
                      <span class="duration-text">9 kk 15 pv</span>
                      <span class="text-size-sm">{{
                        $t("arvio-erikoistumiseen-hyvaksyttavista")
                      }}</span>
                    </div>
                    <div class="d-flex flex-column mb-2 duration-card">
                      <span class="duration-text">4 v 2 kk 15pv</span>
                      <span class="text-size-sm">{{
                        $t("arvio-puuttuvista-koulutuksesta")
                      }}</span>
                    </div>
                  </div>
                </template>
              </elsa-form-group>
              <b-form-row>
                <elsa-form-group :label="$t('koulutustyypit')" class="col-xl-6">
                  <template v-slot="{ uid }">
                    <div
                      :id="uid"
                      class="koulutustyypit bar-chart user-select-none"
                    >
                      <b-table-simple borderless class="text-size-sm mt-3">
                        <b-tr>
                          <b-td class="text-right text-nowrap">{{
                            $t("terveyskeskus")
                          }}</b-td>
                          <b-td class="px-1" style="width: 100%;">
                            <elsa-progress-bar
                              :value="45"
                              color="#ffb406"
                              background-color="#ffe19b"
                            />
                          </b-td>
                          <b-td class="text-nowrap">{{ $t("vah") }} 9 kk</b-td>
                        </b-tr>
                        <b-tr>
                          <b-td class="text-right text-nowrap">{{
                            $t("yliopistosairaala")
                          }}</b-td>
                          <b-td class="px-1">
                            <elsa-progress-bar
                              :value="35"
                              color="#0f9bd9"
                              background-color="#9fd7ef"
                            />
                          </b-td>
                          <b-td class="text-nowrap">{{ $t("vah") }} 12 kk</b-td>
                        </b-tr>
                        <b-tr>
                          <b-td class="text-right text-nowrap">{{
                            $t("yo-sair-ulkopuolinen")
                          }}</b-td>
                          <b-td class="px-1">
                            <elsa-progress-bar
                              :value="10"
                              color="#8a86fb"
                              background-color="#cfcdfd"
                              class="mb-2"
                            />
                          </b-td>
                          <b-td class="text-nowrap">{{ $t("vah") }} 12 kk</b-td>
                        </b-tr>
                        <b-tr>
                          <b-td
                            class="text-right font-weight-500 text-nowrap"
                            >{{ $t("yhteensa") }}</b-td
                          >
                          <b-td class="px-1">
                            <elsa-progress-bar
                              :value="25"
                              color="#41b257"
                              background-color="#b3e1bc"
                            />
                          </b-td>
                          <b-td class="font-weight-500 text-nowrap"
                            >{{ $t("vah") }} 5 v</b-td
                          >
                        </b-tr>
                      </b-table-simple>
                    </div>
                  </template>
                </elsa-form-group>
                <elsa-form-group
                  :label="$t('kaytannon-koulutus')"
                  class="col-xl-6"
                >
                  <template v-slot="{ uid }">
                    <div :id="uid" class="donut-chart">
                      <apexchart
                        :options="donutOptions"
                        :series="donutSeries"
                      ></apexchart>
                    </div>
                  </template>
                </elsa-form-group>
              </b-form-row>
            </div>
          </div>
          <div class="tyoskentelyjaksot-table">
            <b-table
              responsive
              :items="tyoskentelyjaksotFormatted"
              :fields="fields"
            >
              <template #table-colgroup="scope">
                <col
                  v-for="field in scope.fields"
                  :key="field.key"
                  :style="{ width: field.width }"
                />
              </template>
              <template #cell(tyoskentelypaikkaLabel)="row">
                <elsa-button
                  :to="{
                    name: 'tyoskentelyjakso',
                    params: { tyoskentelyjaksoId: row.item.id }
                  }"
                  variant="link"
                  class="shadow-none px-0"
                  >{{ row.item.tyoskentelypaikka.nimi }}</elsa-button
                >
              </template>
              <template #cell(ajankohtaDate)="row">
                {{ row.item.ajankohta }}
              </template>
              <template #cell(keskeytyksetLength)="row">
                <elsa-button
                  v-if="row.item.keskeytyksetLength > 0"
                  @click="row.toggleDetails"
                  variant="link"
                  class="shadow-none text-nowrap px-0"
                  >{{ row.item.keskeytyksetLength }}
                  {{
                    (row.item.keskeytyksetLength == 1
                      ? $t("poissaolo")
                      : $t("poissaoloa")) | lowercase
                  }}<font-awesome-icon
                    :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'"
                    fixed-width
                    size="lg"
                    class="ml-2 text-dark"
                  />
                </elsa-button>
                <span v-else>
                  {{ $t("ei-poissaoloja") }}
                </span>
              </template>
              <template #row-details="row">
                <div class="px-3">
                  <b-table-simple responsive>
                    <b-thead>
                      <b-tr>
                        <b-th>
                          {{ $t("poissaolon-syy") }}
                          <elsa-popover>
                            <template>
                              <h3>{{ $t("poissaolon-syy") }}</h3>
                              <p>{{ $t("poissaolon-syy-kuvaus") }}</p>
                              <h4>
                                {{
                                  $t("koulutuskertymaa-vahentavat-poissaolot")
                                }}
                              </h4>
                              <p>
                                {{ $t("koulutuskertymaa-vahentavat-kuvaus") }}
                              </p>
                              <ul>
                                <li>{{ $t("lorem-ipsum") }}</li>
                              </ul>
                              <h4>
                                {{
                                  $t(
                                    "koulutuskertymaa-vahentavat-poissaolot-yli-30-pv-poissaoloissa"
                                  )
                                }}
                              </h4>
                              <p>
                                {{
                                  $t(
                                    "koulutuskertymaa-vahentavat-yli-30-pv-kuvaus"
                                  )
                                }}
                              </p>
                              <ul>
                                <li>{{ $t("lorem-ipsum") }}</li>
                              </ul>
                            </template>
                          </elsa-popover>
                        </b-th>
                        <b-th>{{ $t("ajankohta") }}</b-th>
                        <b-th>{{ $t("tyoaika") }}</b-th>
                      </b-tr>
                    </b-thead>
                    <b-tbody>
                      <b-tr
                        v-for="(keskeytysaika, index) in row.item.keskeytykset"
                        :key="index"
                      >
                        <b-td>
                          <elsa-button
                            :to="{
                              name: 'poissaolo',
                              params: { poissaoloId: keskeytysaika.id }
                            }"
                            variant="link"
                            class="shadow-none px-0"
                            >{{ keskeytysaika.poissaolonSyy.nimi }}</elsa-button
                          >
                        </b-td>
                        <b-td>{{
                          keskeytysaika.alkamispaiva !=
                          keskeytysaika.paattymispaiva
                            ? `${$date(keskeytysaika.alkamispaiva)}-${$date(
                                keskeytysaika.paattymispaiva
                              )}`
                            : $date(keskeytysaika.alkamispaiva)
                        }}</b-td>
                        <b-td
                          >{{ keskeytysaika.osaaikaprosentti }} %<span
                            v-if="keskeytysaika.osaaikaprosentti === 0"
                          >
                            ({{ $t("koko-tyoajan-poissaolo") }})</span
                          ></b-td
                        >
                      </b-tr>
                    </b-tbody>
                  </b-table-simple>
                </div>
              </template>
            </b-table>
          </div>
          <p class="text-size-sm">
            {{ $t("tyoskentelyjaksot-taulukko-kuvaus") }}
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import { parseISO } from "date-fns";
import ElsaButton from "@/components/button/button.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaPopover from "@/components/popover/popover.vue";
import ElsaProgressBar from "@/components/progress-bar/progress-bar.vue";
import { ajankohtaLabel } from "@/utils/tyoskentelyjakso";
import { toastFail } from "@/utils/toast";

@Component({
  components: {
    ElsaButton,
    ElsaFormGroup,
    ElsaPopover,
    ElsaProgressBar
  }
})
export default class Tyoskentelyjaksot extends Vue {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("tyoskentelyjaksot"),
      active: true
    }
  ];
  tyoskentelyjaksotTaulukko = null as any;
  fields = [
    {
      key: "tyoskentelypaikkaLabel",
      label: this.$t("tyoskentelypaikka"),
      sortable: true
    },
    {
      key: "ajankohtaDate",
      label: this.$t("ajankohta"),
      sortable: true
    },
    {
      key: this.$t("tyoskentelyaika"),
      label: this.$t("tyoskentelyaika"),
      sortable: true
    },
    {
      key: "osaaikaprosenttiLabel",
      label: this.$t("tyoaika"),
      sortable: true
    },
    {
      key: "hyvaksyttyAiempaanErikoisalaanLabel",
      label: this.$t("hyvaksytty-toiselle-erikoisalalle"),
      sortable: true
    },
    {
      key: "keskeytyksetLength",
      label: this.$t("poissaolot"),
      sortable: true
    }
  ];
  loading = true;

  donutSeries = [44, 55, 41, 17];
  donutOptions = {
    colors: ["#41b257", "#0f9bd9", "#8a86fb", "#ffb406"],
    labels: [
      `${this.$t("oma-erikoisala")}: 3 kk 2pv`,
      `${this.$t("omaa-erikoisalaa-tukeva")}: 3 kk 2pv`,
      `${this.$t("tutkimustyo")}: 3 kk 2pv`,
      `${this.$t("terveyskeskustyo")}: 3 kk 2pv`
    ],
    legend: {
      fontSize: "13px",
      fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: false
      }
    },
    chart: {
      type: "donut",
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      formatter: function(val: number) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: "8px",
        fontFamily: "Montserrat, Helvetica, Arial, sans-serif"
      },
      dropShadow: {
        enabled: false
      }
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    stroke: {
      show: false
    },
    states: {
      hover: {
        filter: {
          type: "normal"
        }
      },
      active: {
        filter: {
          type: "normal"
        }
      }
    },
    tooltip: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  async mounted() {
    await this.fetchTyoskentelyjaksot();
    this.loading = false;
  }

  async fetchTyoskentelyjaksot() {
    try {
      this.tyoskentelyjaksotTaulukko = (
        await axios.get(`erikoistuva-laakari/tyoskentelyjaksot-taulukko`)
      ).data;
    } catch (err) {
      toastFail(this, this.$t("tyoskentelyjaksojen-hakeminen-epaonnistui"));
    }
  }

  get tyoskentelyjaksot() {
    if (this.tyoskentelyjaksotTaulukko) {
      return this.tyoskentelyjaksotTaulukko.tyoskentelyjaksot;
    } else {
      return [];
    }
  }

  get keskeytykset() {
    if (this.tyoskentelyjaksotTaulukko) {
      return this.tyoskentelyjaksotTaulukko.keskeytykset;
    } else {
      return [];
    }
  }

  get tyoskentelyjaksotFormatted() {
    const keskeytyksetGroupByTyoskentelyjakso = this.keskeytykset.reduce(
      (result: any, keskeytysaika: any) => {
        const tyoskentelyjaksoId = keskeytysaika.tyoskentelyjakso.id;
        if (tyoskentelyjaksoId in result) {
          result[tyoskentelyjaksoId].push({
            id: keskeytysaika.id,
            alkamispaiva: keskeytysaika.alkamispaiva,
            paattymispaiva: keskeytysaika.paattymispaiva,
            osaaikaprosentti: keskeytysaika.osaaikaprosentti,
            poissaolonSyy: keskeytysaika.poissaolonSyy
          });
        } else {
          result[tyoskentelyjaksoId] = [
            {
              id: keskeytysaika.id,
              alkamispaiva: keskeytysaika.alkamispaiva,
              paattymispaiva: keskeytysaika.paattymispaiva,
              osaaikaprosentti: keskeytysaika.osaaikaprosentti,
              poissaolonSyy: keskeytysaika.poissaolonSyy
            }
          ];
        }
        return result;
      },
      {}
    );

    return this.tyoskentelyjaksot.map((tj: any) => ({
      ...tj,
      tyoskentelypaikkaLabel: tj.tyoskentelypaikka.nimi,
      ajankohtaDate: parseISO(tj.alkamispaiva),
      ajankohta: ajankohtaLabel(this, tj),
      osaaikaprosenttiLabel: `${tj.osaaikaprosentti} %`,
      hyvaksyttyAiempaanErikoisalaanLabel: tj.hyvaksyttyAiempaanErikoisalaan
        ? this.$t("kylla")
        : this.$t("ei"),
      keskeytykset: keskeytyksetGroupByTyoskentelyjakso[tj.id] || [],
      keskeytyksetLength: (keskeytyksetGroupByTyoskentelyjakso[tj.id] || [])
        .length
    }));
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";

.tyoskentelyjaksot {
  max-width: 1024px;
}

.tilastot {
  padding: 200px;
}

.koulutustyypit {
  ::v-deep table {
    td {
      padding: 0;
    }
  }
}

.tyoskentelyjaksot-table {
  ::v-deep table {
    thead th {
      border-top: none;
    }
    td {
      padding-top: 0;
      padding-bottom: 0;
      vertical-align: middle;
      div {
        min-height: $font-size-base * 2.5;
      }
    }
    .b-table-details {
      td {
        padding-left: 0;
        padding-right: 0;
        background: #f5f5f6;
      }
      table {
        th {
          padding-bottom: 0.3rem;
        }
        th:first-child {
          padding-left: 0;
        }
        th:last-child {
          padding-right: 0;
        }
      }
    }
  }
}

.duration-card {
  min-width: 300px;

  .duration-text {
    font-size: 1.25rem;
  }
}
.donut-chart {
  max-width: 450px;
}
.bar-chart {
  max-width: 450px;

  .progress-yellow {
    background-color: #ffe19b;
    .progress-bar {
      background-color: #ffb406;
    }
  }

  .progress-blue {
    background-color: #9fd7ef;
    .progress-bar {
      background-color: #0f9bd9;
    }
  }

  .progress-purple {
    background-color: #cfcdfd;
    .progress-bar {
      background-color: #8a86fb;
    }
  }

  .progress-green {
    background-color: #b3e1bc;
    .progress-bar {
      background-color: #41b257;
    }
  }
}
</style>
