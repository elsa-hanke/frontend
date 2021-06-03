<template>
  <div>
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg class="mb-4">
        <b-col lg="5">
          <h1>{{ $t('koejakso') }}</h1>
          <div class="position-relative align-items-center">
            <b-form-input
              v-model="query"
              placeholder="Hae suoritusarviointeja..."
              class="search-input"
            ></b-form-input>
            <font-awesome-icon
              :icon="['fas', 'search']"
              class="text-primary position-absolute search-icon"
            />
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-table
            responsive
            fixed
            :items="taskList"
            :fields="fields"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :per-page="perPage"
            :current-page="currentPage"
            class="kouluttaja-table"
            details-td-class="row-details"
          >
            <template #table-colgroup>
              <col span="1" width="20%" />
              <col span="1" width="30%" />
              <col span="1" width="17.5%" />
              <col span="1" width="15%" />
              <col span="1" width="17.5%" />
            </template>

            <template #head()="scope">
              <div class="border-top-0 font-weight-bold">{{ scope.label }}</div>
            </template>

            <template #head(pvm)="data">
              <div class="task-type border-top-0 font-weight-bold">
                {{ data.label.toLowerCase() }}
              </div>
            </template>

            <template #cell(nimi)="data">
              {{ data.item.erikoistuvanNimi }}
            </template>

            <template #cell(koejaksonVaihe)="data">
              <b-link
                :to="{
                  name: linkComponent(data.item),
                  params: { id: data.item.id }
                }"
                class="task-type"
              >
                {{ data.item.type }}
              </b-link>
            </template>

            <template #cell(tila)="data">
              <font-awesome-icon
                :icon="taskIcon(data.item.status)"
                :class="taskClass(data.item.status)"
              />
              {{ taskStatus(data.item.status) }}
            </template>

            <template #cell(pvm)="data">
              {{ $date(data.item.muokkauspaiva) }}
            </template>

            <template #cell(actions)="row">
              <b-link
                v-if="row.item.type !== getLomakeTyypit.KOULUTUSSOPIMUS"
                @click="row.toggleDetails"
                class="text-decoration-none"
              >
                {{ row.detailsShowing ? $t('piilota') : $t('nayta') }} {{ $t('aiemmat') }}
                <font-awesome-icon
                  :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'"
                  fixed-width
                  size="lg"
                  class="text-dark"
                />
              </b-link>
            </template>

            <template #row-details="row">
              <div class="row-details-row">
                <div class="row-details-col width-20" />
                <div class="row-details-col width-30">API CHANGES: {{ row.item.id }}</div>
                <div class="row-details-col width-175">TODO</div>
                <div class="row-details-col width-15">DATE</div>
                <div class="row-details-col width-175" />
              </div>
            </template>
          </b-table>

          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            align="center"
            pills
            next-text="Seuraava"
            first-class="d-none"
            last-class="d-none"
          >
            <template slot="prev-text">
              <span class="text-size-lg mr-2">&lsaquo;</span>
              {{ $t('edellinen') }}
            </template>

            <template slot="next-text">
              {{ $t('seuraava') }}
              <span class="text-size-lg ml-2">&rsaquo;</span>
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import store from '@/store'
  import { LomakeTyypit, LomakeTilat, TaskStatus } from '@/utils/constants'

  @Component({})
  export default class KoejaksoViewKouluttaja extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('koejakso'),
        active: true
      }
    ]

    fields = [
      {
        key: 'nimi',
        label: this.$t('nimi'),
        sortable: true
      },
      {
        key: 'koejaksonVaihe',
        label: this.$t('koejakson-vaihe'),
        sortable: true
      },
      {
        key: 'tila',
        label: this.$t('tila'),
        sortable: true
      },
      {
        key: 'pvm',
        label: this.$t('pvm'),
        sortable: true
      },
      {
        key: 'actions',
        label: '',
        sortable: false
      }
    ]
    perPage = 20
    currentPage = 1
    sortBy = 'nimi'
    sortDesc = true

    loading = true
    query = ''

    get koejaksot() {
      return store.getters['kouluttaja/koejaksot']
    }

    get taskList() {
      const arr: any = []
      this.koejaksot.map((a: any) => {
        if (a.koulutussopimus) {
          arr.push({
            ...a.koulutussopimus,
            type: LomakeTyypit.KOULUTUSSOPIMUS,
            status: a.koulutusSopimuksenTila
          })
        }

        if (a.aloituskeskustelu) {
          arr.push({
            ...a.aloituskeskustelu,
            type: LomakeTyypit.ALOITUSKESKUSTELU,
            status: a.aloituskeskustelunTila
          })
        }
      })
      return arr
    }

    get rows() {
      return this.taskList?.length
    }

    get getLomakeTyypit() {
      return LomakeTyypit
    }

    taskIcon(status: string) {
      switch (status) {
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return ['far', 'clock']
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return ['fas', 'undo-alt']
        case LomakeTilat.HYVAKSYTTY:
          return ['far', 'check-circle']
      }
    }

    taskClass(status: string) {
      switch (status) {
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return 'text-warning'
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return ''
        case LomakeTilat.HYVAKSYTTY:
          return 'text-success'
      }
    }

    taskStatus(status: string) {
      switch (status) {
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.AVOIN)
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return this.$t('lomake-tila-' + TaskStatus.PALAUTETTU)
        case LomakeTilat.HYVAKSYTTY:
          return this.$t('lomake-tila-' + TaskStatus.HYVAKSYTTY)
      }
    }

    linkComponent(value: any) {
      switch (value.type) {
        case LomakeTyypit.KOULUTUSSOPIMUS:
          return 'koulutussopimus-kouluttaja'
        case LomakeTyypit.ALOITUSKESKUSTELU:
          return 'aloituskeskustelu-kouluttaja'
      }
      return
    }

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      this.loading = false
    }
  }
</script>

<style lang="scss">
  .task-type {
    text-transform: capitalize;
  }

  .search-input {
    border-radius: 25px;
  }

  .kouluttaja-table {
    .row-details {
      padding: 0;

      &-row {
        display: flex;
      }

      &-col {
        padding: 0.75rem;

        &.width-20 {
          width: 20%;
        }

        &.width-30 {
          width: 30%;
        }

        &.width-175 {
        }
      }
    }
  }
</style>
