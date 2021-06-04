<template>
  <div class="arvioinnit">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('arvioinnit') }}</h1>
          <div class="arvioinnit">
            <div class="w-25 position-relative align-items-center">
              <b-form-input
                v-model="hakusana"
                placeholder="Hae suoritusarviointeja..."
                class="suoritusarviointi-haku"
              ></b-form-input>
              <font-awesome-icon
                :icon="['fas', 'search']"
                class="text-primary position-absolute search-icon"
              />
            </div>
            <div v-if="arvioinnit" class="arvioinnit-table">
              <b-table
                :items="tulokset"
                :fields="fields"
                :sort-compare="sortCompare"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :per-page="perPage"
                :current-page="currentPage"
                fixed
                responsive
                tbody-tr-class="arvioinnit-table-row"
              >
                <template #table-colgroup>
                  <col span="1" style="width: 10%" />
                  <col span="1" style="width: 7.5%" />
                  <col span="1" style="width: 10%" />
                  <col span="1" style="width: 17.5%" />
                  <col span="1" style="width: 30%" />
                  <col span="1" style="width: 15%" />
                  <col span="1" style="width: 10%" />
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
                  {{ $date(row.item.tapahtumanAjankohta) }}
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
                    class="align-items-center text-decoration-none text-nowrap"
                  >
                    {{ $t('tee-arviointi') }}
                  </elsa-button>
                </template>
              </b-table>
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
              ></b-pagination>
            </div>
            <div v-else class="text-center">
              <b-spinner variant="primary" :label="$t('ladataan')" />
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'
  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ElsaButton
    }
  })
  export default class Arvioinnit extends Vue {
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
    arvioinnit: null | any[] = null
    hakusana = ''
    sortBy = 'tila'
    sortDesc = true
    perPage = 10
    currentPage = 1

    async mounted() {
      await this.fetch()
    }

    async fetch() {
      try {
        this.arvioinnit = (await axios.get('kouluttaja/suoritusarvioinnit')).data
      } catch (err) {
        this.arvioinnit = []
      }
    }

    get tulokset() {
      return this.hakusana
        ? this.arvioinnit?.filter((item) => item.arvioitavaTapahtuma.includes(this.hakusana))
        : this.arvioinnit
    }

    get rows() {
      return this.tulokset?.length
    }

    sortCompare(a: any, b: any, key: string): any {
      if (key == 'tila') {
        if (a.lukittu) {
          return 1
        }
        if (b.lukittu) {
          return -1
        }
        if (a.arviointiAika) {
          return 1
        }
        if (b.arviointiAika) {
          return -1
        }
        return 0
      }
      return false
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
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
        padding: 0.25rem 0.75rem;
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

  .suoritusarviointi-haku {
    border-radius: 25px;
  }

  .text-light-muted {
    color: #b1b1b1;
  }

  .tapahtuma-field {
    max-width: 1px;
  }
</style>
