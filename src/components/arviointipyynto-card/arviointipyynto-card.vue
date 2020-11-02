<template>
  <div>
    <b-container fluid class="px-0 mb-3">
      <b-row>
        <b-col lg="8">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-size-lg font-weight-500 mr-3">
              {{ value.arvioitavaTapahtuma }}
            </div>
            <div class="separator">{{ value.tapahtumanAjankohta }}</div>
          </div>
        </b-col>
        <b-col class="d-flex align-items-center">
          <div>{{ value.tyoskentelyjakso.tyoskentelypaikka.nimi }}</div>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="px-0">
      <b-row>
        <b-col lg="8">
          <div class="flex-fill">
            <b-table-simple borderless responsive>
              <tr>
                <th
                  scope="row"
                  class="py-0 pl-0 pr-1 font-weight-500"
                  style="width: 33.33%"
                >
                  {{ $t("epa-osaamisalue") }}
                </th>
                <td class="py-0 pr-0 pl-1">
                  {{ value.arvioitavaOsaalue.nimi }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-0 pl-0 pr-1 font-weight-500">
                  {{ $t("arvioitavana") }}
                </th>
                <td class="py-0 pr-0 pl-1">
                  {{ value.arvioinninAntaja.nimi }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-0 pl-0 pr-1 font-weight-500">
                  {{ $t("lisatiedot") }}
                </th>
                <td class="py-0 pr-0 pl-1">{{ value.lisatiedot }}</td>
              </tr>
            </b-table-simple>
          </div>
          <b-button variant="outline-primary" class="mr-2">{{
            $t("tee-itsearviointi")
          }}</b-button>
          <b-button variant="primary">{{
            $t("muokkaa-arviointipyyntoa")
          }}</b-button>
        </b-col>
      </b-row>
    </b-container>
    <hr />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class ArviointipyyntoCard extends Vue {
  @Prop({})
  value!: any;

  tableValue = {
    fields: [
      { key: "epa", label: "Hoitovastuun siirtäminen" },
      { key: "arviointi", label: "Arviointi" },
      { key: "itsearviointi", label: "Itsearviointi" }
    ],
    items: [
      {
        epa: this.$t("luottamuksen-taso"),
        arviointi: 3,
        itsearviointi: 4
      }
    ]
  };
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";
@import "~bootstrap/scss/mixins/breakpoints";

.separator {
  &::after {
    content: "|";
    position: absolute;
    right: -2px;
    @include media-breakpoint-down(md) {
      display: none;
    }
  }
}

::v-deep table {
  thead tr {
    border-bottom: solid $gray-300 1px;
  }
  th:first-child {
    padding-left: 0;
  }
  th:last-child {
    padding-right: 0;
  }
  td {
    vertical-align: middle;
  }
  td:first-child {
    padding-left: 0;
  }
  td:last-child {
    padding-right: 0;
  }
}
</style>
