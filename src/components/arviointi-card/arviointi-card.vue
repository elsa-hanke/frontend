<template>
  <div>
    <b-container fluid class="px-0">
      <b-row>
        <b-col lg="8">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-size-lg font-weight-500 mr-3">Potilaan siirto</div>
            <div>10.10.2020</div>
          </div>
        </b-col>
        <b-col>Laaksolahden terveyskeskus</b-col>
      </b-row>
    </b-container>
    <b-container fluid class="px-0">
      <b-row>
        <b-col lg="8">
          <b-table
            responsive
            small
            borderless
            :fields="value.fields"
            :items="value.items"
          >
            <template v-slot:cell(epa)="data">
              <span>{{ data.item.epa }}</span>
              <b-link v-b-popover.hover.right="'Lorem ipsum...'">
                <font-awesome-layers fixed-width class="ml-1">
                  <font-awesome-icon fixed-width :icon="['far', 'circle']" />
                  <font-awesome-icon
                    fixed-width
                    icon="info"
                    transform="shrink-8"
                  />
                </font-awesome-layers>
              </b-link>
            </template>
            <template v-slot:cell(arviointi)="data">
              <div class="d-flex icon-star">
                <font-awesome-icon
                  icon="star"
                  transform="shrink-8"
                  size="2x"
                  v-for="idx in data.item.arviointi"
                  :key="`a-${idx}`"
                />
                <font-awesome-icon
                  :icon="['far', 'star']"
                  transform="shrink-8"
                  size="2x"
                  v-for="idx in maxValue - data.item.arviointi"
                  :key="`b-${idx}`"
                />
              </div>
            </template>
            <template v-slot:cell(itsearviointi)="data">
              <div class="d-flex icon-star">
                <font-awesome-icon
                  icon="star"
                  transform="shrink-8"
                  size="2x"
                  v-for="idx in data.item.arviointi"
                  :key="`c-${idx}`"
                />
                <font-awesome-icon
                  :icon="['far', 'star']"
                  transform="shrink-8"
                  size="2x"
                  v-for="idx in maxValue - data.item.arviointi"
                  :key="`d-${idx}`"
                />
              </div>
            </template>
          </b-table>
          <b-button variant="primary">{{ $t("avaa-arviointi") }}</b-button>
        </b-col>
      </b-row>
    </b-container>
    <hr />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class ArviointiCard extends Vue {
  value = {
    fields: [
      { key: "epa", label: "Hoitovastuun siirtäminen" },
      { key: "arviointi", label: "Arviointi" },
      { key: "itsearviointi", label: "Itsearviointi" }
    ],
    items: [
      {
        epa: "Terveyden ja hyvinvoinnin edistäminen",
        arviointi: 3,
        itsearviointi: 4
      },
      {
        epa: "Oma osaaminen ja tiedonhallinta",
        arviointi: 2,
        itsearviointi: 4
      }
    ]
  };
  maxValue = 5;
}
</script>

<style lang="scss" scoped>
::v-deep table {
  thead tr {
    border-bottom: solid #ced4da 1px;
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

.icon-star {
  color: #ffc107;
}
</style>
