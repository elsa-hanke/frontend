<template>
  <div class="arvioinnit">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("arvioinnit") }}</h1>
          <div class="arvioinnit">
            <div class="arvioinnit-table" v-if="arvioinnit">
              <b-table
                :items="arvioinnit"
                :fields="fields"
                :sort-compare="sortCompare"
                responsive
              >
                <template #table-colgroup="scope">
                  <col
                    v-for="field in scope.fields"
                    :key="field.key"
                    :style="{ width: field.width }"
                  />
                </template>
                <template #cell(arvioitavaTapahtuma)="row">
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
                <template #cell(tapahtumanAjankohta)="row">
                  {{ $date(row.item.tapahtumanAjankohta) }}
                </template>
                <template #cell(tila)="row">
                  <span v-if="row.item.lukittu" class="text-nowrap">
                    <font-awesome-icon
                      :icon="['fas', 'check-circle']"
                      class="text-success"
                    />
                    {{ $t("hyvaksytty") }}
                  </span>
                  <span v-else-if="row.item.arviointiAika" class="text-nowrap">
                    <font-awesome-icon
                      :icon="['far', 'check-circle']"
                      class="text-success"
                    />
                    {{ $t("valmis") }}
                  </span>
                  <span v-else class="text-nowrap">
                    <font-awesome-icon
                      :icon="['far', 'clock']"
                      class="text-warning"
                    />
                    {{ $t("avoin") }}
                  </span>
                </template>
                <!-- eslint-disable-next-line -->
                <template #cell(arvioinninSaaja.nimi)="row">
                  {{ row.item.arvioinninSaaja.nimi }}
                </template>
                <!-- eslint-disable-next-line -->
                <template #cell(arvioitavaOsaalue.nimi)="row">
                  {{ row.item.arvioitavaOsaalue.nimi }}
                </template>
                <!-- eslint-disable-next-line -->
                <template #cell(tyoskentelyjakso.tyoskentelypaikka.nimi)="row">
                  {{ row.item.tyoskentelyjakso.tyoskentelypaikka.nimi }}
                </template>
                <template #cell(teeArviointi)="row">
                  <elsa-button
                    v-if="!row.item.arviointiAika"
                    variant="primary"
                    :to="{
                      name: 'muokkaa-arviointia',
                      params: { arviointiId: row.item.id }
                    }"
                    class="d-flex align-items-center text-decoration-none text-nowrap"
                  >
                    {{ $t("tee-arviointi") }}
                  </elsa-button>
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
import ElsaButton from "@/components/button/button.vue";

@Component({
  components: {
    ElsaButton
  }
})
export default class Arvioinnit extends Vue {
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
      key: "arvioitavaTapahtuma",
      label: this.$t("tapahtuma"),
      sortable: true
    },
    {
      key: "tapahtumanAjankohta",
      label: this.$t("pvm"),
      sortable: true
    },
    {
      key: "tila",
      label: this.$t("tila"),
      sortable: true
    },
    {
      key: "arvioinninSaaja.nimi",
      label: this.$t("nimi"),
      sortable: true
    },
    {
      key: "arvioitavaOsaalue.nimi",
      label: this.$t("epa-osaamisalue"),
      sortable: true
    },
    {
      key: "tyoskentelyjakso.tyoskentelypaikka.nimi",
      label: this.$t("tyoskentelypaikka"),
      sortable: true
    },
    {
      key: "teeArviointi",
      label: ""
    }
  ];
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

  sortCompare(a: any, b: any, key: string): any {
    if (key == "tila") {
      if (a.lukittu) {
        return 1;
      }
      if (b.lukittu) {
        return -1;
      }
      if (a.arviointiAika) {
        return 1;
      }
      if (b.arviointiAika) {
        return -1;
      }
      return 0;
    }
    return false;
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";
.arvioinnit-table {
  ::v-deep table {
    thead th {
      border-top: none;

      // Ilman tätä, rikkoo responsiivisuuden
      .sr-only {
        display: none;
      }
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
          padding-left: 0;
          padding-right: 0;
        }
      }
    }
  }
}

.text-light-muted {
  color: #b1b1b1;
}
</style>
