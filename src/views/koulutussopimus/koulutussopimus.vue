<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg>
        <b-col>
          <h1 class="mb-3">{{ $t('koulutussopimus') }}</h1>
          <div v-if="editable">
            <p>{{ $t('koulutussopimus-ingressi-1') }}</p>
            <p>
              {{ $t('koulutussopimus-ingressi-2') }}
              <b-link :to="{ name: 'koejakso-yleiset-tavoitteet' }">
                {{ $t('koejakso-tavoitteet-linkki') }}
              </b-link>
            </p>
          </div>
          <div v-if="odottaaHyvaksyntaa" class="d-flex bg-light border rounded px-4 py-3">
            <font-awesome-icon icon="info-circle" fixed-width class="text-muted mr-2" />
            <div>{{ $t('koulutussopimus-text-odottaa-hyväksyntää') }}</div>
          </div>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <user-details-table :account="account"></user-details-table>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <koulutussopimus-form
            v-if="editable"
            :editable="editable"
            :data="koulutusopimusData"
            :account="account"
            :kouluttajat="kouluttajat"
            @refreshKouluttajat="onKouluttajatRefresh"
            @saveAndExit="onSaveDraftAndExit"
            @submit="onSubmit"
          ></koulutussopimus-form>

          <koulutussopimus-readonly
            v-if="!editable"
            :data="koulutusopimusData"
          ></koulutussopimus-readonly>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { KoulutussopimusLomake } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import store from '@/store'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import UserDetailsTable from '@/views/koulutussopimus/user-details-table.vue'
  import KoulutussopimusForm from '@/views/koulutussopimus/koulutussopimus-form.vue'
  import KoulutussopimusReadonly from '@/views/koulutussopimus/koulutussopimus-readonly.vue'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { KoulutussopimusTilat } from '@/utils/constants'

  @Component({
    components: {
      UserDetailsTable,
      KoulutussopimusForm,
      KoulutussopimusReadonly
    }
  })
  export default class Koulutussopimus extends Mixins(ConfirmRouteExit) {
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
        text: this.$t('koulutussopimus'),
        active: true
      }
    ]
    loading = true
    koulutussopimusLomake: null | KoulutussopimusLomake = null
    koejakso: any = null
    kouluttajat: [] = []

    get koulutusopimusData() {
      return this.koulutussopimusLomake
    }

    get account() {
      return store.getters.account
    }

    get editable() {
      switch (this.koejakso.koulutusSopimuksenTila) {
        case KoulutussopimusTilat.PALAUTETTU_KORJATTAVAKSI:
          return true
        case KoulutussopimusTilat.UUSI:
          return true
        case KoulutussopimusTilat.TALLENNETTU_KESKENERAISENA:
          return true
      }
      return false
    }

    get odottaaHyvaksyntaa() {
      return this.koejakso.koulutusSopimuksenTila === KoulutussopimusTilat.ODOTTAA_HYVAKSYNTAA
    }

    // TODO REPLACE WITH KOULUTTUJAT API
    async fetchKouluttajat() {
      this.kouluttajat = (
        await axios.get('erikoistuva-laakari/suoritusarvioinnit-rajaimet')
      ).data.kouluttajat
    }

    onKouluttajatRefresh() {
      this.fetchKouluttajat()
    }

    async fetchKoejakso() {
      try {
        const { data } = await axios.get(`erikoistuva-laakari/koejakso`)
        if (data.koulutussopimus) {
          this.koejakso = data
          this.koulutussopimusLomake = data.koulutussopimus
          if (this.koulutussopimusLomake?.erikoistuvanNimi) {
            this.koulutussopimusLomake.erikoistuvanNimi = this.account.firstName.concat(
              ' ',
              this.account.lastName
            )
          }
        } else {
          this.koejakso = data
        }
        if (!this.editable) {
          this.skipRouteExitConfirm = true
        }
      } catch (err) {
        toastFail(this, this.$t('suoritemerkinnan-lomakkeen-hakeminen-epaonnistui'))
      }
    }

    async saveNewForm() {
      try {
        await axios.post('erikoistuva-laakari/koejakso/koulutussopimus', this.koulutussopimusLomake)
        checkCurrentRouteAndRedirect(this.$router, '/koejakso/koulutussopimus')
        toastSuccess(this, this.$t('koulutussopimus-lisatty-onnistuneesti'))
        this.fetchKoejakso()
      } catch (err) {
        toastFail(this, this.$t('koulutussopimuksen-lisaaminen-epaonnistui'))
      }
    }

    async updateSentForm() {
      try {
        await axios.put('erikoistuva-laakari/koejakso/koulutussopimus', this.koulutussopimusLomake)
        checkCurrentRouteAndRedirect(this.$router, '/koejakso/koulutussopimus')
        toastSuccess(this, this.$t('koulutussopimus-lisatty-onnistuneesti'))
        this.fetchKoejakso()
      } catch (err) {
        toastFail(this, this.$t('koulutussopimuksen-lisaaminen-epaonnistui'))
      }
    }

    async onSaveDraftAndExit(form: KoulutussopimusLomake, params: any) {
      params.saving = true
      this.koulutussopimusLomake = form
      try {
        if (this.koejakso.koulutusSopimuksenTila === KoulutussopimusTilat.UUSI) {
          await axios.post(
            'erikoistuva-laakari/koejakso/koulutussopimus',
            this.koulutussopimusLomake
          )
        } else if (
          this.koejakso.koulutusSopimuksenTila === KoulutussopimusTilat.TALLENNETTU_KESKENERAISENA
        ) {
          await axios.put(
            'erikoistuva-laakari/koejakso/koulutussopimus',
            this.koulutussopimusLomake
          )
        } else {
          toastFail(this, this.$t('koulutussopimuksen-tallennus-epaonnistui'))
        }

        toastSuccess(this, this.$t('koulutussopimus-tallennettu-onnistuneesti'))
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
      } catch (err) {
        toastFail(this, this.$t('koulutussopimuksen-tallennus-epaonnistui'))
      }
      params.saving = false
    }

    onSubmit(form: KoulutussopimusLomake, params: any) {
      params.saving = true
      this.koulutussopimusLomake = form
      this.koulutussopimusLomake.lahetetty = true
      if (
        this.koejakso.koulutusSopimuksenTila === KoulutussopimusTilat.TALLENNETTU_KESKENERAISENA
      ) {
        this.updateSentForm()
      } else if (
        this.koejakso.koulutusSopimuksenTila === KoulutussopimusTilat.PALAUTETTU_KORJATTAVAKSI
      ) {
        this.updateSentForm()
      } else {
        this.saveNewForm()
      }
      params.saving = false
    }

    async mounted() {
      this.loading = true
      await this.fetchKoejakso()
      await this.fetchKouluttajat()
      this.loading = false
      if (!this.editable) {
        this.skipRouteExitConfirm = true
      }
    }
  }
</script>
