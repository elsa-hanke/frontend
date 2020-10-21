<template>
  <div>
    <b-container fluid class="px-0">
      <b-row>
        <b-col lg="8">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-size-lg font-weight-500 mr-3">
              {{ value.arvioitavaTapahtuma }}
            </div>
            <div>{{ value.tapahtumanAjankohta }}</div>
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
            :fields="tableValue.fields"
            :items="tableValue.items"
          >
            <template v-slot:cell(epa)="data">
              {{ data.item.epa }}
              <b-link v-b-popover.hover.right="'Lorem ipsum...'">
                <font-awesome-layers fixed-width>
                  <font-awesome-icon :icon="['far', 'circle']" />
                  <font-awesome-icon icon="info" transform="shrink-8" />
                </font-awesome-layers>
              </b-link>
            </template>
            <template v-slot:cell(arviointi)="data">
              <b-form-rating
                inline
                no-border
                stars="5"
                :readonly="true"
                :value="data.item.arviointi"
                class="text-star p-0"
              ></b-form-rating>
            </template>
            <template v-slot:cell(itsearviointi)="data">
              <b-link
                variant="link"
                class="d-flex align-items-center text-decoration-none"
                :to="{
                  name: 'itsearviointi',
                  params: { arviointiId: value.id }
                }"
                v-if="data.index === 0"
              >
                {{ $t("tee-itsearviointi") }}
              </b-link>
            </template>
          </b-table>
          <b-button
            variant="primary"
            :to="{ name: 'arviointi', params: { arviointiId: value.id } }"
            >{{ $t("avaa-arviointi") }}</b-button
          >
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
export default class ArviointiCard extends Vue {
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
@import "~@/styles/variables";

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
