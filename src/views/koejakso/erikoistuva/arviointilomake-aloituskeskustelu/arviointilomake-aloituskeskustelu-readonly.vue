<template>
  <div>
    <b-row>
      <b-col>
        <h5>{{ $t('sahkopostiosoite') }}</h5>
        <p>{{ data.erikoistuvanSahkoposti }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5>{{ $t('koejakson-suorituspaikka') }}</h5>
        <p>{{ data.koejaksonSuorituspaikka }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="4">
        <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
        <p>{{ $date(data.koejaksonAlkamispaiva) }}</p>
      </b-col>
      <b-col lg="4">
        <h5>{{ $t('koejakson-päättymispäivä') }}</h5>
        <p>{{ $date(data.koejaksonPaattymispaiva) }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="8">
        <h5>{{ $t('koejakso-suoritettu-kokoaikatyössä') }}</h5>
        <p>{{ suoritettuKokoaikatyossa }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="8">
        <h5>{{ $t('tarvittavat-liitteet') }}</h5>
        <b-table-simple fixed class="mb-0">
          <b-thead>
            <b-tr>
              <b-th class="border-top-0">
                {{ $t('tiedoston-nimi') }}
              </b-th>
              <b-th class="border-top-0">
                {{ $t('lisatty') }}
              </b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-td>Todo.pdf</b-td>
              <b-td>1.1.2021</b-td>
            </b-tr>
            <b-tr>
              <b-td>Todo.pdf</b-td>
              <b-td>1.1.2021</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col>
        <h3>{{ $t('koulutuspaikan-arvioijat') }}</h3>
        <h5>{{ $t('lahikouluttaja') }}</h5>
        <p>{{ data.lahikouluttaja.nimi }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
        <p>{{ data.lahiesimies.nimi }}</p>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col>
        <h3>{{ $t('aloituskeskustelu-tavoitteet') }}</h3>
        <h5>{{ $t('koejakso-osaamistavoitteet') }}</h5>
        <p>{{ data.koejaksonOsaamistavoitteet }}</p>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col lg="8">
        <h3>{{ $t('allekirjoitukset') }}</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="4">
        <h5>{{ $t('päiväys') }}</h5>
        <p v-if="erikoistuvaAllekirjoitus">{{ $date(erikoistuvaAllekirjoitus) }}</p>
        <p v-if="kouluttajaAllekirjoitus">{{ $date(kouluttajaAllekirjoitus) }}</p>
        <p v-if="lahiesimiesAllekirjoitus">{{ $date(lahiesimiesAllekirjoitus) }}</p>
      </b-col>
      <b-col lg="4">
        <h5>{{ $t('nimi-ja-nimike') }}</h5>
        <p v-if="erikoistuvaAllekirjoitus">{{ data.erikoistuvanNimi }}</p>
        <p v-if="kouluttajaAllekirjoitus">{{ data.lahikouluttaja.nimi }}</p>
        <p v-if="lahiesimiesAllekirjoitus">{{ data.lahiesimies.nimi }}</p>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { AloituskeskusteluLomake } from '@/types'

  @Component
  export default class ArviointilomakeAloituskeskusteluReadonly extends Vue {
    @Prop({ required: true, default: {} })
    data!: AloituskeskusteluLomake

    get suoritettuKokoaikatyossa() {
      return this.data.suoritettuKokoaikatyossa ? this.$t('kylla') : this.suoritettuOsaAikatyossa
    }

    get suoritettuOsaAikatyossa() {
      return (
        this.$t('ei') +
        ', ' +
        this.$t('suoritettu-osa-aikatyossa').toString().toLowerCase() +
        ': ' +
        this.data.tyotunnitViikossa +
        this.$t('tuntia-viikossa')
      )
    }

    get erikoistuvaAllekirjoitus() {
      return this.data.erikoistuvanAllekirjoitusaika
    }

    get kouluttajaAllekirjoitus() {
      return this.data.lahikouluttaja.kuittausaika
    }

    get lahiesimiesAllekirjoitus() {
      return this.data.lahiesimies.kuittausaika
    }
  }
</script>
