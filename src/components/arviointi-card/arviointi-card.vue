<template>
  <div>
    <b-container fluid class="px-0">
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
          <div>Laaksolahden terveyskeskus</div>
        </b-col>
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
              <div
                :class="{
                  'ml-3': data.index !== 0,
                  'font-weight-500': data.index === 0
                }"
              >
                {{ data.item.epa }}
                <!--
                <b-link v-b-popover.hover.right="'Lorem ipsum...'">
                  <font-awesome-layers fixed-width>
                    <font-awesome-icon :icon="['far', 'circle']" />
                    <font-awesome-icon icon="info" transform="shrink-8" />
                  </font-awesome-layers>
                </b-link>
                -->
              </div>
            </template>
            <template v-slot:cell(arviointi)="data">
              <elsa-luottamuksen-taso :value="data.item.arviointi" />
            </template>
            <template v-slot:cell(itsearviointi)="data">
              <elsa-luottamuksen-taso
                v-if="data.item.itsearviointi"
                :value="data.item.itsearviointi"
              />
              <div v-else class="d-inline-flex">
                <b-button
                  v-if="data.index === 0"
                  variant="primary"
                  class="d-flex align-items-center text-decoration-none"
                  :to="{
                    name: 'itsearviointi',
                    params: { arviointiId: value.id }
                  }"
                >
                  {{ $t("tee-itsearviointi") }}
                </b-button>
              </div>
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
import ElsaLuottamuksenTaso from "@/components/luottamuksen-taso/luottamuksen-taso.vue";

@Component({
  components: {
    ElsaLuottamuksenTaso
  }
})
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
        epa: this.$t("luottamuksen-taso"),
        arviointi: 3,
        itsearviointi: 4
      }
    ]
  };
  maxValue = 5;
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
