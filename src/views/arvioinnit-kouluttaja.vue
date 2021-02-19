<template>
  <div class="arvioinnit">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("arvioinnit") }}</h1>
          <div class="arvioinnit">
            <div class="tyoskentelyjaksot-table" v-if="arvioinnit">
              <b-table :items="arvioinnit" :fields="fields" responsive>
                <template #table-colgroup="scope">
                  <col
                    v-for="field in scope.fields"
                    :key="field.key"
                    :style="{ width: field.width }"
                  />
                </template>
                <template #cell(tapahtumaLabel)="row">
                  <elsa-button
                    :to="{
                      name: 'arviointi',
                      params: { arviointiId: row.item.id }
                    }"
                    variant="link"
                    class="shadow-none px-0"
                    >{{ row.item.arvioitavaTapahtuma }}</elsa-button
                  >
                </template>
                <template #cell(pvmDate)="row">
                  {{ $date(row.item.tapahtumanAjankohta) }}
                </template>
                <template #cell(tilaLabel)="row">
                  <span v-if="row.item.lukittu">
                    <font-awesome-icon
                      :icon="['fas', 'check-circle']"
                      class="text-success"
                    />
                    {{ $t("hyvaksytty") }}
                  </span>
                  <span v-else-if="row.item.arviointiAika">
                    <font-awesome-icon
                      :icon="['far', 'check-circle']"
                      class="text-success"
                    />
                    {{ $t("valmis") }}
                  </span>
                  <span v-else>
                    <font-awesome-icon
                      :icon="['far', 'clock']"
                      class="text-warning"
                    />
                    {{ $t("avoin") }}
                  </span>
                </template>
                <template #cell(nimiLabel)="row">
                  {{ row.item.arvioinninSaaja.nimi }}
                </template>
                <template #cell(epaosaamisalueLabel)="row">
                  {{ row.item.arvioitavaOsaalue.nimi }}
                </template>
                <template #cell(tyoskentelypaikkaLabel)="row">
                  {{ row.item.tyoskentelyjakso.tyoskentelypaikka.nimi }}
                </template>
                <template #cell(ajankohtaDate)="row">
                  {{ row.item.ajankohta }}
                </template>
                <template #cell(teeArviointi)="row">
                  <elsa-button
                    v-if="!row.item.arviointiAika"
                    variant="primary"
                    :to="{ name: 'arviointi' }"
                    class="d-flex align-items-center text-decoration-none"
                  >
                    {{ $t("tee-arviointi") }}
                  </elsa-button>
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
                                <elsa-poissaolon-syyt
                                  :value="tilastotPoissaolonSyyt"
                                />
                              </template>
                            </elsa-popover>
                          </b-th>
                          <b-th>{{ $t("ajankohta") }}</b-th>
                          <b-th>{{ $t("tyoaika") }}</b-th>
                        </b-tr>
                      </b-thead>
                      <b-tbody>
                        <b-tr
                          v-for="(keskeytysaika, index) in row.item
                            .keskeytykset"
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
                              >{{
                                keskeytysaika.poissaolonSyy.nimi
                              }}</elsa-button
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
                          <b-td>
                            <span
                              v-if="
                                keskeytysaika.osaaikaprosentti ===
                                  row.item.osaaikaprosentti
                              "
                            >
                              {{ $t("koko-tyoajan-poissaolo") }}</span
                            >
                            <span v-else>
                              {{ 100 - keskeytysaika.osaaikaprosentti }} %
                            </span>
                          </b-td>
                        </b-tr>
                      </b-tbody>
                    </b-table-simple>
                  </div>
                </template>
              </b-table>
            </div>
            <div class="text-center" v-else>
              <b-spinner variant="primary" :label="$t('ladataan')" />
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import ArviointipyyntoCard from "@/components/arviointipyynto-card/arviointipyynto-card.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";
import ElsaButton from "@/components/button/button.vue";
import ElsaBadge from "@/components/badge/badge.vue";
import { tyoskentelyjaksoLabel } from "@/utils/tyoskentelyjakso";

@Component({
  components: {
    ArviointipyyntoCard,
    ElsaFormGroup,
    ElsaFormMultiselect,
    ElsaButton,
    ElsaBadge
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
  fields = [
    {
      key: "tapahtumaLabel",
      label: this.$t("tapahtuma"),
      sortable: true
    },
    {
      key: "pvmDate",
      label: this.$t("pvm"),
      sortable: true
    },
    {
      key: "tilaLabel",
      label: this.$t("tila"),
      sortable: true
    },
    {
      key: "nimiLabel",
      label: this.$t("nimi"),
      sortable: true
    },
    {
      key: "epaosaamisalueLabel",
      label: this.$t("epa-osaamisalue"),
      sortable: true
    },
    {
      key: "tyoskentelypaikkaLabel",
      label: this.$t("tyoskentelypaikka"),
      sortable: true
    },
    {
      key: "teeArviointi",
      label: ""
    }
  ];
  kategoriat: null | any[] = null;
  arvioinnit: null | any[] = null;

  async mounted() {
    await this.fetch();
  }

  async fetch() {
    try {
      this.arvioinnit = (await axios.get("kouluttaja/suoritusarvioinnit")).data;
    } catch (err) {
      this.arvioinnit = [];
    }
  }

  solveKategoriat() {
    // Muodostetaan osa-alueet lista
    const osaalueet = (this.selected.tyoskentelyjakso ||
    this.selected.kouluttaja
      ? this.omat?.map((oma: any) => oma.arvioitavaOsaalue)
      : this.options.epaOsaamisalueet.filter((oa: any) =>
          this.selected.epaOsaamisalue
            ? oa.id === this.selected.epaOsaamisalue?.id
            : true
        )
    ).map((oa: any) => ({
      ...oa,
      arvioinnit: [],
      visible: false
    }));

    // Muodostetaan kategoriat lista
    let kategoriat: any[] = [];
    osaalueet.forEach((oa: any) => {
      kategoriat.push({
        ...oa.kategoria,
        osaalueet: [],
        visible: true
      });
    });
    kategoriat = [
      ...new Map(kategoriat.map((item: any) => [item["id"], item])).values()
    ];

    // Laitetaan arvioinnin osa-alueihin
    if (this.omat) {
      this.omat.forEach(arviointi => {
        const oa = osaalueet.find(
          (oa: any) => oa.id === arviointi.arvioitavaOsaalueId
        );
        if (oa) {
          oa.arvioinnit.push(arviointi);
        }
      });
    }

    // Laitetaan osa-aluuet kategorioihin
    osaalueet.forEach((oa: any) => {
      const kategoria = kategoriat.find((k: any) => k.id === oa.kategoria.id);
      if (kategoria) {
        kategoria.osaalueet.push(oa);
      }
    });

    return kategoriat;
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
.kategoria-collapse {
  background: #f5f5f6;
}

::v-deep .multiselect {
  .multiselect__option::after {
    display: none;
  }
}

::v-deep table {
  thead tr th {
    border-top: none;
    border-bottom: none;
  }
  tbody tr:first-child td {
    border-top: none;
  }
  td {
    vertical-align: middle;
  }
  td,
  th {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.text-light-muted {
  color: #b1b1b1;
}
</style>
