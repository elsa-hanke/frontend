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
          <div
            class="d-flex justify-content-center border rounded py-5 mb-4 text-danger"
          >
            TODO: Työskentelypaikka erikoisalalla
          </div>
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
                      <b-th>{{ $t("poissaolon-syy") }}</b-th>
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
import { ajankohtaLabel } from "@/utils/tyoskentelyjakso";
import { toastFail } from "@/utils/toast";

@Component({
  components: {
    ElsaButton
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
</style>
