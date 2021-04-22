<template>
  <div>
    <b-row>
      <b-col lg="8">
        <h5>{{ $t('koulutusopimus-form.opinto-oikeuden-alkamispäivä') }}</h5>
        <p>{{ $date(data.opintooikeudenMyontamispaiva) }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="8">
        <h5>{{ $t('koulutusopimus-form.koejakson-alkamispäivä') }}</h5>
        <p>{{ $date(data.koejaksonAlkamispaiva) }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="4">
        <h5>{{ $t('sähköpostiosoite') }}</h5>
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
          <p>TODO</p>
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
        <p>TODO</p>
      </b-col>
      <b-col lg="4">
        <h5>{{ $t('nimi-ja-nimike') }}</h5>
        <p>{{ data.erikoistuvanNimi }}</p>
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
  }
</script>
