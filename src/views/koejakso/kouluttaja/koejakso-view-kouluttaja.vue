<template>
  <div>
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg>
        <b-col>
          <h3>Kouluttaja</h3>
          <b-table-simple>
            <b-thead>
              <b-tr>
                <b-th class="border-top-0">{{ $t('nimi') }}</b-th>
                <b-th class="border-top-0">{{ $t('koejakson-vaihe') }}</b-th>
                <b-th class="border-top-0">{{ $t('tila') }}</b-th>
                <b-th class="capitalize-first border-top-0">{{ $t('pvm').toLowerCase() }}</b-th>
                <b-th class="border-top-0"></b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(k, index) in taskList" :key="index">
                <b-th>{{ k.erikoistuvanNimi }}</b-th>
                <b-th>
                  <b-link
                    :to="{
                      name: linkComponent(k),
                      params: { id: k.id }
                    }"
                    class="task-type"
                  >
                    {{ k.type }}
                  </b-link>
                </b-th>
                <b-th>{{ taskStatus(k.status) }}</b-th>
                <b-th>{{ $date(k.muokkauspaiva) }}</b-th>
              </b-tr>
            </b-tbody>
          </b-table-simple>
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

    loading = true

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

    taskStatus(status: string) {
      switch (status) {
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return TaskStatus.AVOIN
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return TaskStatus.PALAUTETTU
        case LomakeTilat.HYVAKSYTTY:
          return TaskStatus.HYVAKSYTTY
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
</style>
