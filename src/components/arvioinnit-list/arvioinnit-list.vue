<template>
  <div>
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('suoritusarvioinnit') }}</h1>
          <search-input
            class="mb-4"
            :hakutermi.sync="hakutermi"
            :placeholder="$t('hae-suoritusarviointeja')"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div v-if="!loading">
            <b-alert v-if="rows === 0" variant="dark" show>
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              <span v-if="hakutermi.length > 0">
                {{ $t('ei-hakutuloksia') }}
              </span>
              <span v-else>
                {{ $t('ei-suoritusarviointeja') }}
              </span>
            </b-alert>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
          <div class="arvioinnit">
            <b-table
              v-if="!loading && rows > 0"
              class="arvioinnit-table"
              :items="tulokset"
              :fields="fields"
              :per-page="perPage"
              :current-page="currentPage"
              fixed
              responsive
            >
              <template #table-colgroup>
                <col span="1" style="width: 22%" />
                <col span="1" style="width: 7%" />
                <col span="1" style="width: 9%" />
                <col span="1" style="width: 13%" />
                <col span="1" style="width: 29%" />
                <col span="1" style="width: 15%" />
                <col span="1" style="width: 9rem" />
              </template>
              <template #cell(arvioitavaTapahtuma)="row">
                <elsa-button
                  :to="{
                    name: 'arviointi',
                    params: { arviointiId: row.item.id }
                  }"
                  variant="link"
                  class="shadow-none px-0 text-truncate text-left w-100"
                >
                  {{ row.item.arvioitavaTapahtuma }}
                </elsa-button>
              </template>
              <template #cell(tapahtumanAjankohta)="row">
                <span class="text-nowrap">
                  {{ $date(row.item.tapahtumanAjankohta) }}
                </span>
              </template>
              <template #cell(tila)="row">
                <span v-if="row.item.lukittu" class="text-nowrap">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success" />
                  {{ $t('hyvaksytty') }}
                </span>
                <span v-else-if="row.item.arviointiAika" class="text-nowrap">
                  <font-awesome-icon :icon="['far', 'check-circle']" class="text-success" />
                  {{ $t('valmis') }}
                </span>
                <span v-else class="text-nowrap">
                  <font-awesome-icon :icon="['far', 'clock']" class="text-warning" />
                  {{ $t('avoin') }}
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
                  class="d-flex text-nowrap pt-1 pb-1"
                >
                  {{ $t('tee-arviointi') }}
                </elsa-button>
              </template>
            </b-table>
            <pagination :currentPage.sync="currentPage" :perPage="perPage" :rows="rows" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import ElsaButton from '@/components/button/button.vue'
  import SearchInput from '@/components/search-input/search-input.vue'
  import Pagination from '@/components/pagination/pagination.vue'

  @Component({
    components: {
      ElsaButton,
      SearchInput,
      Pagination
    }
  })
  export default class ArvioinnitList extends Vue {
    @Prop({ required: true, default: undefined })
    arvioinnit!: null | any[]

    @Prop({ required: false, type: Boolean, default: false })
    loading!: boolean

    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arvioinnit'),
        active: true
      }
    ]
    fields = [
      {
        key: 'arvioitavaTapahtuma',
        label: this.$t('tapahtuma'),
        sortable: true,
        tdClass: 'tapahtuma-field'
      },
      {
        key: 'tapahtumanAjankohta',
        label: this.$t('pvm'),
        sortable: true
      },
      {
        key: 'tila',
        label: this.$t('tila'),
        sortable: true
      },
      {
        key: 'arvioinninSaaja.nimi',
        label: this.$t('nimi'),
        sortable: true
      },
      {
        key: 'arvioitavaOsaalue.nimi',
        label: this.$t('epa-osaamisalue'),
        sortable: true
      },
      {
        key: 'tyoskentelyjakso.tyoskentelypaikka.nimi',
        label: this.$t('tyoskentelypaikka'),
        sortable: true
      },
      {
        key: 'teeArviointi',
        label: ''
      }
    ]

    hakutermi = ''
    perPage = 20
    currentPage = 1

    get tulokset() {
      return this.hakutermi
        ? this.arvioinnit?.filter((item) =>
            item.arvioitavaTapahtuma.toLowerCase().includes(this.hakutermi.toLowerCase())
          )
        : this.arvioinnit
    }

    get rows() {
      return this.tulokset?.length
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .arvioinnit-table {
    max-width: 1420px;
    ::v-deep table {
      td {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        vertical-align: middle;
      }
    }
  }
</style>
