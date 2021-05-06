<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <h1 class="mb-3">{{ $t('koulutussopimus') }}</h1>
      <div v-if="editable">
        <p>{{ $t('koulutussopimus-kouluttaja-ingressi') }}</p>
      </div>

      <div v-if="!editable" class="d-flex bg-light border rounded px-4 py-3 mb-4">
        <font-awesome-icon icon="info-circle" fixed-width class="text-muted mr-2" />
        <div>{{ $t('koulutussopimus-kouluttaja-allekirjoitettu') }}</div>
      </div>

      <b-form @submit.stop.prevent="onSubmit">
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('opinto-oikeuden-alkamispäivä') }}</h5>
            <p>{{ $date(koulutussopimus.opintooikeudenMyontamispaiva) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
            <p>{{ $date(koulutussopimus.koejaksonAlkamispaiva) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <h5>{{ $t('sahkopostiosoite') }}</h5>
            <p>{{ koulutussopimus.erikoistuvanSahkoposti }}</p>
          </b-col>
          <b-col lg="4">
            <h5>{{ $t('puhelin-virka-aikaan') }}</h5>
            <p>{{ koulutussopimus.erikoistuvanPuhelinnumero }}</p>
          </b-col>
        </b-row>

        <hr />

        <b-row>
          <b-col lg="8">
            <h3>{{ $t('koulutuspaikan-tiedot') }}</h3>
            <div v-for="(koulutuspaikka, index) in koulutussopimus.koulutuspaikat" :key="index">
              <h5>{{ $t('toimipaikan-nimi') }}</h5>
              <p>{{ koulutuspaikka.nimi }}</p>
              <h5>{{ $t('toimipaikalla-koulutussopimus.header') }}</h5>
              <p>TODO</p>
            </div>
          </b-col>
        </b-row>

        <hr />

        <b-row>
          <b-col>
            <h3>{{ $t('koulutuspaikan-lahikouluttaja') }}</h3>
            <div v-for="(kouluttaja, index) in koulutussopimus.kouluttajat" :key="index">
              <kouluttaja-koulutussopimus-form
                v-if="!kouluttaja.sopimusHyvaksytty"
                :kouluttaja="kouluttaja"
                v-model="form.kouluttajat[index]"
              ></kouluttaja-koulutussopimus-form>

              <kouluttaja-koulutussopimus-readonly
                v-else
                :kouluttaja="kouluttaja"
              ></kouluttaja-koulutussopimus-readonly>
            </div>
          </b-col>
        </b-row>

        <hr />

        <b-row>
          <b-col lg="8">
            <h3>{{ $t('erikoisala-vastuuhenkilö') }}</h3>
            <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
            <p>
              {{ koulutussopimus.vastuuhenkilo.nimi }}, {{ koulutussopimus.vastuuhenkilo.nimike }}
            </p>
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
            <p>{{ koulutussopimus.erikoistuvanNimi }}</p>
          </b-col>
        </b-row>

        <hr v-if="editable" />

        <b-row v-if="editable">
          <b-col>
            <elsa-button variant="outline-primary" @click="returnToSender">
              {{ $t('palauta-muokattavaksi') }}
            </elsa-button>
          </b-col>
          <b-col class="text-right">
            <elsa-button variant="back" :to="{ name: 'koejakso' }">{{ $t('peruuta') }}</elsa-button>
            <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-4 px-5">
              {{ $t('allekirjoita-lähetä') }}
            </elsa-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import store from '@/store'
  import KouluttajaKoulutussopimusForm from '@/views/koejakso/kouluttaja/koulutussopimus/kouluttaja-koulutussopimus-form.vue'
  import ElsaButton from '@/components/button/button.vue'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { KoulutussopimusLomake, Kouluttaja } from '@/types'
  import { defaultKouluttaja, defaultKoulutuspaikka } from '@/utils/constants'
  import KouluttajaKoulutussopimusReadonly from '@/views/koejakso/kouluttaja/koulutussopimus/kouluttaja-koulutussopimus-readonly.vue'

  @Component({
    components: {
      KouluttajaKoulutussopimusForm,
      ElsaButton,
      KouluttajaKoulutussopimusReadonly
    }
  })
  export default class KouluttajaKoulutussopimus extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('koejakso'),
        to: { name: 'koejakso' }
      },
      {
        text: this.$t('koulutussopimus-kouluttaja'),
        active: true
      }
    ]

    params = {
      saving: false,
      deleting: false
    }
    loading = true
    validateState = false
    form: KoulutussopimusLomake = {
      erikoistuvanNimi: '',
      erikoistuvanOpiskelijatunnus: '',
      erikoistuvanPuhelinnumero: '',
      erikoistuvanSahkoposti: '',
      erikoistuvanSyntymaaika: '2021-03-31',
      erikoistuvanYliopisto: '',
      koejaksonAlkamispaiva: '',
      korjausehdotus: '',
      kouluttajat: [defaultKouluttaja],
      koulutuspaikat: [defaultKoulutuspaikka],
      lahetetty: false,
      muokkauspaiva: '',
      opintooikeudenMyontamispaiva: '',
      vastuuhenkilo: null
    } as any

    get koulutussopimusId() {
      return Number(this.$route.params.id)
    }

    get koejaksoData() {
      return store.getters['kouluttaja/getKoulutussopimus'](this.koulutussopimusId)
    }

    get koulutussopimus() {
      return this.koejaksoData.koulutussopimus
    }

    get editable() {
      return !this.koulutussopimus.kouluttajat.every((k: Kouluttaja) => k.sopimusHyvaksytty)
    }

    returnToSender() {
      return
    }

    async updateSentForm() {
      try {
        await store.dispatch('kouluttaja/putKoulutussopimus', this.form)

        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('koulutussopimus-lisatty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('koulutussopimuksen-lisaaminen-epaonnistui'))
      }
    }

    async onSubmit(params: any) {
      params.saving = true
      this.form.lahetetty = false
      this.updateSentForm()
      params.saving = false
    }

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      this.form = this.koulutussopimus
      this.loading = false
    }
  }
</script>
