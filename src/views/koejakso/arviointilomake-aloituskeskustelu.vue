<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg>
        <b-col>
          <h1 class="mb-3">{{ $t('koejakson-aloituskeskustelu') }}</h1>
          <div v-if="editable">
            <p>{{ $t('koejakson-aloituskeskustelu-ingressi-1') }}</p>
            <p>
              {{ $t('koejakson-aloituskeskustelu-ingressi-2') }}
              <b-link :to="{ name: 'koejakso-yleiset-tavoitteet' }">
                {{ $t('koejakso-tavoitteet-linkki') }}
              </b-link>
            </p>
          </div>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <user-details :account="account" :show-birthdate="false"></user-details>
        </b-col>
      </b-row>
      <hr />
      <arviointilomake-aloituskeskustelu-form
        v-if="editable"
        :account="account"
        :data="aloituskeskusteluData"
        :kouluttajat="kouluttajat"
        :henkilot="kouluttajat"
        @kouluttajaAdded="onKouluttajatAdded"
        @saveAndExit="onSaveDraftAndExit"
        @submit="onSubmit"
      ></arviointilomake-aloituskeskustelu-form>

      <arviointilomake-aloituskeskustelu-readonly
        v-if="!editable"
        :data="aloituskeskusteluData"
      ></arviointilomake-aloituskeskustelu-readonly>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import store from '@/store'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import { AloituskeskusteluLomake } from '@/types'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { LomakeTilat } from '@/utils/constants'
  import UserDetails from '@/components/user-details/user-details.vue'
  import ArviointilomakeAloituskeskusteluForm from '@/views/koejakso/arviointilomake-aloituskeskustelu/arviointilomake-aloituskeskustelu-form.vue'
  import ArviointilomakeAloituskeskusteluReadonly from '@/views/koejakso/arviointilomake-aloituskeskustelu/arviointilomake-aloituskeskustelu-readonly.vue'

  @Component({
    components: {
      UserDetails,
      ArviointilomakeAloituskeskusteluForm,
      ArviointilomakeAloituskeskusteluReadonly
    }
  })
  export default class ArviointilomakeAloituskeskustelu extends Mixins(ConfirmRouteExit) {
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
        text: this.$t('koejakson-aloituskeskustelu'),
        active: true
      }
    ]
    loading = true
    aloituskeskusteluLomake: null | AloituskeskusteluLomake = null
    koejakso: any = null
    kouluttajat: [] = []

    get account() {
      return store.getters.account
    }

    get editable() {
      switch (this.koejakso.aloituskeskustelunTila) {
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return true
        case LomakeTilat.UUSI:
          return true
        case LomakeTilat.TALLENNETTU_KESKENERAISENA:
          return true
      }
      return false
    }

    get aloituskeskusteluData() {
      return this.aloituskeskusteluLomake
    }

    async fetchKoejakso() {
      try {
        const { data } = await axios.get(`erikoistuva-laakari/koejakso`)
        this.koejakso = data
        if (data.aloituskeskustelu) {
          this.aloituskeskusteluLomake = data.aloituskeskustelu

          if (this.aloituskeskusteluLomake) {
            if (!this.aloituskeskusteluLomake.erikoistuvanNimi) {
              this.aloituskeskusteluLomake.erikoistuvanNimi = this.account.firstName.concat(
                ' ',
                this.account.lastName
              )
            }
            if (data.aloituskeskustelu.koejaksonAlkamispaiva) {
              this.aloituskeskusteluLomake.koejaksonAlkamispaiva =
                data.aloituskeskustelu.koejaksonAlkamispaiva
            }
          }
        }
        if (!this.editable) {
          this.skipRouteExitConfirm = true
        }
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-hakeminen-epaonnistui'))
      }
    }

    // TODO REPLACE WITH KOULUTTUJAT API
    async fetchKouluttajat() {
      this.kouluttajat = (
        await axios.get('erikoistuva-laakari/suoritusarvioinnit-rajaimet')
      ).data.kouluttajat
    }

    onKouluttajatAdded() {
      this.fetchKouluttajat()
    }

    async onSaveDraftAndExit(form: AloituskeskusteluLomake, params: any) {
      params.saving = true
      this.aloituskeskusteluLomake = form
      try {
        await axios.post(
          'erikoistuva-laakari/koejakso/aloituskeskutelu',
          this.aloituskeskusteluLomake
        )
        toastSuccess(this, this.$t('aloituskeskustelu-tallennettu-onnistuneesti'))
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-tallennus-epaonnistui'))
      }
      params.saving = false
    }

    async saveNewForm() {
      try {
        await axios.post(
          'erikoistuva-laakari/koejakso/aloituskeskustelu',
          this.aloituskeskusteluLomake
        )
        checkCurrentRouteAndRedirect(this.$router, '/koejakso/aloituskeskustelu')
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    async updateSentForm() {
      try {
        await axios.put(
          'erikoistuva-laakari/koejakso/aloituskeskustelu',
          this.aloituskeskusteluLomake
        )
        checkCurrentRouteAndRedirect(this.$router, '/koejakso/aloituskeskustelu')
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
        this.fetchKoejakso()
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    onSubmit(form: AloituskeskusteluLomake, params: any) {
      params.saving = true
      this.aloituskeskusteluLomake = form
      this.aloituskeskusteluLomake.lahetetty = true
      if (this.koejakso.aloituskeskustelunTila === LomakeTilat.TALLENNETTU_KESKENERAISENA) {
        this.updateSentForm()
      } else if (this.koejakso.aloituskeskustelunTila === LomakeTilat.PALAUTETTU_KORJATTAVAKSI) {
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
    }
  }
</script>
