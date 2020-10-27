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
          todo
          <b-button variant="outline-primary">{{
            $t("muokkaa-arviointipyyntoa")
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
