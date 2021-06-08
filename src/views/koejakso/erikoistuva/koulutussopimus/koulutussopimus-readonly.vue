<template>
  <div>
    <b-row>
      <b-col lg="8">
        <h5>{{ $t('opinto-oikeuden-alkamispäivä') }}</h5>
        <p>{{ $date(data.opintooikeudenMyontamispaiva) }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="8">
        <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
        <p>{{ $date(data.koejaksonAlkamispaiva) }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="4">
        <h5>{{ $t('sahkopostiosoite') }}</h5>
        <p>{{ data.erikoistuvanSahkoposti }}</p>
      </b-col>
      <b-col lg="4">
        <h5>{{ $t('puhelin-virka-aikaan') }}</h5>
        <p>{{ data.erikoistuvanPuhelinnumero }}</p>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col lg="8">
        <h3>{{ $t('koulutuspaikan-tiedot') }}</h3>
        <div v-for="(koulutuspaikka, index) in data.koulutuspaikat" :key="index">
          <h5>{{ $t('toimipaikan-nimi') }}</h5>
          <p>{{ koulutuspaikka.nimi }}</p>
          <h5>{{ $t('toimipaikalla-koulutussopimus.header') }}</h5>
          <p>{{ koulutuspaikka.yliopisto ? koulutuspaikka.yliopisto : $t('kylla') }}</p>
        </div>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col lg="8">
        <h3>{{ $t('koulutuspaikan-lahikouluttaja') }}</h3>
        <div v-for="(kouluttaja, index) in data.kouluttajat" :key="index">
          <h5>{{ $t('lahikouluttaja') }}</h5>
          <p>{{ kouluttaja.nimi }}</p>
        </div>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col lg="8">
        <h3>{{ $t('erikoisala-vastuuhenkilö') }}</h3>
        <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
        <p>{{ data.vastuuhenkilo.nimi }}, {{ data.vastuuhenkilo.nimike }}</p>
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
        <div v-if="kouluttajatAllekirjoitus.length > 1">
          <p v-for="(k, index) in kouluttajatAllekirjoitus" :key="index">
            {{ $date(k.kuittausaika) }}
          </p>
        </div>
        <p v-if="vastuuhenkiloAllekirjoitus">{{ $date(vastuuhenkiloAllekirjoitus) }}</p>
      </b-col>
      <b-col lg="4">
        <h5>{{ $t('nimi-ja-nimike') }}</h5>
        <p v-if="erikoistuvaAllekirjoitus">{{ data.erikoistuvanNimi }}</p>
        <div v-if="kouluttajatAllekirjoitus.length > 1">
          <p v-for="(k, index) in kouluttajatAllekirjoitus" :key="index">
            {{ k.nimi }}
          </p>
        </div>
        <p v-if="vastuuhenkiloAllekirjoitus">
          {{ data.vastuuhenkilo.nimi }}, {{ data.vastuuhenkilo.nimike }}
        </p>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { KoulutussopimusLomake } from '@/types'

  @Component
  export default class KoulutussopimusReadonly extends Vue {
    @Prop({ required: true, default: {} })
    data!: KoulutussopimusLomake

    get erikoistuvaAllekirjoitus() {
      return this.data.erikoistuvanAllekirjoitusaika
    }

    get kouluttajatAllekirjoitus() {
      return this.data.kouluttajat.map((a) => {
        if (a.kuittausaika) {
          return a
        }
        return 0
      })
    }

    get vastuuhenkiloAllekirjoitus() {
      return this.data.vastuuhenkilo?.kuittausaika
    }
  }
</script>
