<template>
  <div>
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
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
              <b-tr v-for="(k, index) in koejaksot" :key="index">
                <b-th>{{ k.koulutussopimus.erikoistuvanNimi }}</b-th>
                <b-th>
                  <b-link
                    :to="{
                      name: 'koulutussopimus-kouluttaja',
                      params: { id: k.koulutussopimus.id }
                    }"
                  >
                    {{ k.koulutussopimus.id }}
                  </b-link>
                </b-th>
                <b-th></b-th>
                <b-th>{{ $date(k.koulutussopimus.muokkauspaiva) }}</b-th>
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

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      this.loading = false
    }
  }
</script>
