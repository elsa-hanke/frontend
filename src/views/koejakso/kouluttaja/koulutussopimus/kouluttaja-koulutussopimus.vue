<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <h1 class="mb-3">{{ $t('koulutussopimus') }}</h1>
      <div v-if="!signed">
        <p>{{ $t('koulutussopimus-kouluttaja-ingressi') }}</p>
      </div>

      <div v-if="signed" class="d-flex bg-light border rounded px-4 py-3 mb-4">
        <font-awesome-icon icon="info-circle" fixed-width class="text-muted mr-2" />
        <div>{{ $t('koulutussopimus-kouluttaja-allekirjoitettu') }}</div>
      </div>

      <div v-if="returned" class="bg-light border rounded px-4 py-3 mb-4">
        <div class="d-flex">
          <font-awesome-icon icon="info-circle" fixed-width class="text-muted mr-2" />
          <div>
            <div>{{ $t('koulutussopimus-kouluttaja-palautettu') }}</div>
            <div>
              <span>{{ $t('syy') }}</span>
              <span>&nbsp;{{ form.korjausehdotus }}</span>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div>
        <b-row>
          <b-col lg="3" class="font-weight-500">{{ $t('erikoistuva-laakari') }}:</b-col>
          <b-col>{{ form.erikoistuvanNimi }}, {{ form.erikoistuvanErikoisala }}</b-col>
        </b-row>

        <b-row>
          <b-col lg="3" class="font-weight-500">{{ $t('opiskelijanumero') }}:</b-col>
          <b-col>{{ form.erikoistuvanOpiskelijatunnus }}</b-col>
        </b-row>

        <b-row>
          <b-col lg="3" class="font-weight-500">{{ $t('syntymaaika') }}:</b-col>
          <b-col>{{ $date(form.erikoistuvanSyntymaaika) }}</b-col>
        </b-row>

        <b-row>
          <b-col lg="3" class="font-weight-500">{{ $t('yliopisto-opiskeluoikeus') }}:</b-col>
          <b-col>{{ form.erikoistuvanYliopisto }}</b-col>
        </b-row>
      </div>

      <hr />

      <b-form @submit.stop.prevent="onSubmit">
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('opinto-oikeuden-alkamispäivä') }}</h5>
            <p>{{ $date(form.opintooikeudenMyontamispaiva) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
            <p>{{ $date(form.koejaksonAlkamispaiva) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <h5>{{ $t('sahkopostiosoite') }}</h5>
            <p>{{ form.erikoistuvanSahkoposti }}</p>
          </b-col>
          <b-col lg="4">
            <h5>{{ $t('puhelin-virka-aikaan') }}</h5>
            <p>{{ form.erikoistuvanPuhelinnumero }}</p>
          </b-col>
        </b-row>

        <hr />

        <b-row>
          <b-col lg="8">
            <h3>{{ $t('koulutuspaikan-tiedot') }}</h3>
            <div v-for="(koulutuspaikka, index) in form.koulutuspaikat" :key="index">
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
            <div
              v-for="(kouluttaja, index) in form.kouluttajat"
              :key="index"
              class="kouluttaja-section"
            >
              <kouluttaja-koulutussopimus-form
                v-if="currentKouluttaja(kouluttaja) && editable"
                ref="kouluttajaKoulutussopimusForm"
                v-model="form.kouluttajat[index]"
                :kouluttaja="kouluttaja"
                :index="index"
                @ready="isValid"
              ></kouluttaja-koulutussopimus-form>

              <kouluttaja-koulutussopimus-readonly
                v-if="!currentKouluttaja(kouluttaja) || !editable"
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
            <p>{{ form.vastuuhenkilo.nimi }}, {{ form.vastuuhenkilo.nimike }}</p>
          </b-col>
        </b-row>

        <hr />

        <div v-if="editable">
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
              <p>{{ form.erikoistuvanNimi }}</p>
            </b-col>
          </b-row>
        </div>

        <hr v-if="editable" />

        <b-row v-if="editable">
          <b-col>
            <elsa-button variant="outline-primary" v-b-modal.return-to-sender>
              {{ $t('palauta-muokattavaksi') }}
            </elsa-button>
          </b-col>
          <b-col class="text-right">
            <elsa-button variant="back" :to="{ name: 'koejakso' }">{{ $t('peruuta') }}</elsa-button>
            <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-4 px-5">
              {{ $t('allekirjoita-laheta') }}
            </elsa-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <b-modal id="return-to-sender" :title="$t('palauta-erikoistuvalle-muokattavaksi')">
      <div class="d-block">
        <b-form>
          <elsa-form-group :label="$t('syy-palautukseen')" :required="true">
            <template v-slot="{ uid }">
              <b-form-textarea
                :id="uid"
                v-model="form.korjausehdotus"
                :state="validateState('korjausehdotus')"
                rows="4"
                class="textarea-min-height"
              ></b-form-textarea>
            </template>
          </elsa-form-group>
        </b-form>
      </div>

      <template #modal-footer>
        <elsa-button variant="back" @click="hideModal">
          {{ $t('peruuta') }}
        </elsa-button>

        <elsa-button variant="primary" @click="returnToSender">
          {{ $t('palauta-muokattavaksi') }}
        </elsa-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import _get from 'lodash/get'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import * as api from '@/api/kouluttaja'
  import store from '@/store'
  import KouluttajaKoulutussopimusForm from '@/views/koejakso/kouluttaja/koulutussopimus/kouluttaja-koulutussopimus-form.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { KoulutussopimusLomake, Kouluttaja } from '@/types'
  import { defaultKoulutuspaikka, LomakeTilat } from '@/utils/constants'
  import KouluttajaKoulutussopimusReadonly from '@/views/koejakso/kouluttaja/koulutussopimus/kouluttaja-koulutussopimus-readonly.vue'
  import UserDetails from '@/components/user-details/user-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'

  @Component({
    components: {
      KouluttajaKoulutussopimusForm,
      ElsaFormGroup,
      ElsaButton,
      KouluttajaKoulutussopimusReadonly,
      UserDetails
    },
    validations: {
      form: {
        korjausehdotus: {
          required
        }
      }
    }
  })
  export default class KouluttajaKoulutussopimus extends Mixins(ConfirmRouteExit, validationMixin) {
    skipRouteExitConfirm!: boolean
    $refs!: {
      kouluttajaKoulutussopimusForm: any
    }
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

    form: KoulutussopimusLomake = {
      id: null,
      erikoistuvanNimi: '',
      erikoistuvanOpiskelijatunnus: '',
      erikoistuvanPuhelinnumero: '',
      erikoistuvanSahkoposti: '',
      erikoistuvanSyntymaaika: '2021-03-31',
      erikoistuvanYliopisto: '',
      koejaksonAlkamispaiva: '',
      korjausehdotus: '',
      kouluttajat: [],
      koulutuspaikat: [defaultKoulutuspaikka],
      lahetetty: false,
      muokkauspaiva: '',
      opintooikeudenMyontamispaiva: '',
      vastuuhenkilo: null
    }

    loading = true

    formValid = false

    hideModal() {
      return this.$bvModal.hide('return-to-sender')
    }

    validateState(value: string) {
      const form = this.$v.form
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    checkForm() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }
    }

    isValid(index: number, form: Kouluttaja) {
      this.form.kouluttajat[index] = form
      this.formValid = true
    }

    get koulutussopimusTila() {
      return store.getters['kouluttaja/koejaksot'].find((a: any) => a.id === this.koulutussopimusId)
    }

    get koulutussopimusId() {
      return Number(this.$route.params.id)
    }

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      return this.koulutussopimusTila !== LomakeTilat.PALAUTETTU_KORJATTAVAKSI
    }

    get signed() {
      return this.form.kouluttajat.every((k: Kouluttaja) => {
        if (this.currentKouluttaja(k)) {
          return k.sopimusHyvaksytty
        }
      })
    }

    get returned() {
      return (
        this.koulutussopimusTila.koulutusSopimuksenTila === LomakeTilat.PALAUTETTU_KORJATTAVAKSI
      )
    }

    //TODO switch to email when it is added to KayttajaDTO
    currentKouluttaja(kouluttaja: any) {
      const nimi = this.account.firstName.concat(' ', this.account.lastName)
      return kouluttaja.nimi === nimi
    }

    async returnToSender() {
      this.checkForm()

      const form = {
        ...this.form,
        korjausehdotus: this.form.korjausehdotus,
        lahetetty: false
      }
      try {
        await store.dispatch('kouluttaja/putKoulutussopimus', form)
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('koulutussopimus-palautettu-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('koulutussopimus-palautus-epaonnistui'))
      }
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

    onSubmit(params: any) {
      params.saving = true

      if (this.$refs.kouluttajaKoulutussopimusForm.length === 2) {
        this.$refs.kouluttajaKoulutussopimusForm[0].checkForm()
        this.$refs.kouluttajaKoulutussopimusForm[1].checkForm()
      } else {
        this.$refs.kouluttajaKoulutussopimusForm[0].checkForm()
      }

      if (this.formValid) {
        this.skipRouteExitConfirm = true
        this.updateSentForm()
      }
      params.saving = false
    }

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      const { data } = await api.getKoulutussopimus(this.koulutussopimusId)
      this.form = data
      this.loading = false

      if (this.returned) {
        this.skipRouteExitConfirm = true
      }

      if (!this.editable) {
        this.skipRouteExitConfirm = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .kouluttaja-section + .kouluttaja-section {
    margin-top: 2.5rem;
  }
</style>
