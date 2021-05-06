<template>
  <div>
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('koejakso') }}</h1>
          <p>
            {{ $t('koejakso-kuvaus') }}
            <b-link :to="{ name: 'koejakso-yleiset-tavoitteet' }">
              {{ $t('koejakso-tavoitteet-linkki') }}
            </b-link>
          </p>
        </b-col>
      </b-row>

      <b-row lg>
        <b-col>
          <div class="d-flex justify-content-center border rounded pt-3 pb-3 mb-4">
            <div class="container-fluid">
              <h2>{{ $t('koejakson-suorituspaikka') }}</h2>
              <p>{{ $t('koejakson-suorituspaikka-kuvaus') }}</p>
              <b-row>
                <b-col cols="9">
                  <b-row>
                    <b-col cols="lg" class="mb-2 mb-lg-0">
                      {{ $t('tyoskentelyjakso') }}
                    </b-col>
                    <b-col cols="lg" align-self-lg="end">
                      <p class="text-lg-right">
                        <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
                        <b-link>{{ $t('lisaa-tyoskentelyjakso') }}</b-link>
                        {{ $t('jos-et-loyda-alta') }}
                      </p>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="9" class="mb-2 mb-md-0">
                  <elsa-form-multiselect
                    v-model="selected.tyoskentelyjakso"
                    :options="tyoskentelyjaksotFormatted"
                    label="label"
                    track-by="id"
                    @select="onTyoskentelyjaksoSelect"
                  />
                </b-col>
                <b-col>
                  <elsa-button variant="primary" class="align-self-end">
                    {{ $t('liita-koejaksoon') }}
                  </elsa-button>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>

      <b-row lg>
        <b-col>
          <elsa-koulutussopimus-card></elsa-koulutussopimus-card>
        </b-col>
      </b-row>

      <b-row lg>
        <b-col>
          <h1>{{ $t('koejakson-arviointi') }}</h1>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">A</span>
                {{ $t('aloituskeskustelu-otsikko') }}
              </h2>
              <p>{{ $t('lomake-ei-täytetty') }}</p>
              <elsa-button
                variant="primary"
                :to="{ name: 'koejakson-aloituskeskustelu' }"
                class="mb-4"
              >
                {{ $t('täytä-aloituskeskustelu') }}
              </elsa-button>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">B</span>
                {{ $t('väliarviointi-otsikko') }}
              </h2>
              <p>{{ $t('lomake-ei-täytetty') }}</p>
              <elsa-button variant="primary" :to="{ name: 'arviointipyynto' }" class="mb-4">
                {{ $t('pyyda-arviointia') }}
              </elsa-button>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">C</span>
                {{ $t('kehittämistoimenpiteet-otsikko') }}
              </h2>
              <p>{{ $t('lomake-ei-täytetty') }}</p>
              <elsa-button variant="primary" :to="{ name: 'arviointipyynto' }" class="mb-4">
                {{ $t('pyyda-arviointia') }}
              </elsa-button>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">D</span>
                {{ $t('loppukeskustelu-otsikko') }}
              </h2>
              <p>{{ $t('lomake-ei-täytetty') }}</p>
              <elsa-button variant="primary" :to="{ name: 'arviointipyynto' }" class="mb-4">
                {{ $t('pyyda-arviointia') }}
              </elsa-button>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">E</span>
                {{ $t('koejakson-arvio-otsikko') }}
              </h2>
              <p>{{ $t('lomake-ei-täytetty') }}</p>
              <elsa-button variant="primary" :to="{ name: 'arviointipyynto' }" class="mb-4">
                {{ $t('pyyda-arviointia') }}
              </elsa-button>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import store from '@/store'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaLuottamuksenTaso from '@/components/luottamuksen-taso/luottamuksen-taso.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaKoulutussopimusCard from '@/components/koulutussopimus-card/koulutussopimus-card.vue'

  @Component({
    components: {
      ElsaButton,
      ElsaPopover,
      ElsaLuottamuksenTaso,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaKoulutussopimusCard
    }
  })
  export default class KoejaksoViewErikoistuva extends Vue {
    selected = {
      tyoskentelyjakso: null,
      epaOsaamisalue: null,
      kouluttaja: null
    } as any
    options = {
      tyoskentelyjaksot: [],
      epaOsaamisalueet: [],
      kouluttajat: []
    } as any
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

    // TODO REFACTOR AND/OR REMOVE
    get tyoskentelyjaksotFormatted() {
      // console.log('tyoskentelyjaksotFormatted()...')
      return this.options.tyoskentelyjaksot.map((tj: any) => ({
        ...tj,
        label: tyoskentelyjaksoLabel(this, tj)
      }))
    }

    // TODO REFACTOR AND/OR REMOVE
    async onTyoskentelyjaksoSelect(selected: any) {
      // console.log('onTyoskentelyjaksoSelect()...')
      this.selected.tyoskentelyjakso = selected
      await this.fetch()
    }

    // TODO REFACTOR AND/OR REMOVE
    async fetch(options: any = {}) {
      try {
        const res = (
          await axios.get('erikoistuva-laakari/suoritusarvioinnit', {
            params: {
              ...options,
              sort: 'tapahtumanAjankohta,desc',
              'tyoskentelyjaksoId.equals': this.selected.tyoskentelyjakso?.id,
              'arvioitavaOsaalueId.equals': this.selected.epaOsaamisalue?.id,
              'arvioinninAntajaId.equals': this.selected.kouluttaja?.id
            }
          })
        ).data
        console.log('xxx:' + res.toString())
        //this.kategoriat = this.solveKategoriat();
      } catch (err) {
        //this.omat = [];
      }
    }

    // mounted() {
    //   // const oppimistavoitteet = (await axios.get('erikoistuva-laakari/oppimistavoitteet-taulukko')).data
    //   // console.log(oppimistavoitteet.toString())
    // }

    async mounted() {
      await store.dispatch('erikoistuva/getKoejakso')
      await store.dispatch('erikoistuva/getKouluttajat')
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .form-order {
    font-weight: bold;
  }
</style>
