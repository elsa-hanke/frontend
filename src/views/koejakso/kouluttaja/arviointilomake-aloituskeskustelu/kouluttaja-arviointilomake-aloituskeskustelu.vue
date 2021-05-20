<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <h1 class="mb-3">{{ $t('aloituskeskustelu-kouluttaja') }}</h1>

      <div v-if="editable">
        <p>{{ $t('aloituskeskustelu-kouluttaja-ingressi') }}</p>
      </div>

      <div v-if="!editable && showSentMsg" class="d-flex bg-light border rounded px-4 py-3 mb-4">
        <font-awesome-icon icon="info-circle" fixed-width class="text-muted mr-2" />
        <div>{{ $t('koulutussopimus-kouluttaja-allekirjoitettu') }}</div>
      </div>

      <hr />

      <div>
        <b-row>
          <b-col lg="3" class="font-weight-500">{{ $t('erikoistuva-laakari') }}:</b-col>
          <b-col>
            {{ aloituskeskustelu.erikoistuvanNimi }}, {{ aloituskeskustelu.erikoistuvanErikoisala }}
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="3" class="font-weight-500">{{ $t('opiskelijanumero') }}:</b-col>
          <b-col>{{ aloituskeskustelu.erikoistuvanOpiskelijatunnus }}</b-col>
        </b-row>

        <b-row>
          <b-col lg="3" class="font-weight-500">{{ $t('yliopisto-opiskeluoikeus') }}:</b-col>
          <b-col>{{ aloituskeskustelu.erikoistuvanYliopisto }}</b-col>
        </b-row>
      </div>

      <hr />

      <div>
        <b-row>
          <b-col>
            <h5>{{ $t('sahkopostiosoite') }}</h5>
            <p>{{ aloituskeskustelu.erikoistuvanSahkoposti }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5>{{ $t('koejakson-suorituspaikka') }}</h5>
            <p>{{ aloituskeskustelu.koejaksonSuorituspaikka }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
            <p>{{ $date(aloituskeskustelu.koejaksonAlkamispaiva) }}</p>
          </b-col>
          <b-col lg="4">
            <h5>{{ $t('koejakson-päättymispäivä') }}</h5>
            <p>{{ $date(aloituskeskustelu.koejaksonPaattymispaiva) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('koejakso-suoritettu-kokoaikatyössä') }}</h5>
            <p>{{ aloituskeskustelu.suoritettuKokoaikatyossa }}</p>
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
            <p>{{ aloituskeskustelu.lahikouluttaja.nimi }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
            <p>{{ aloituskeskustelu.lahiesimies.nimi }}</p>
          </b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col>
            <h3>{{ $t('aloituskeskustelu-tavoitteet') }}</h3>
            <h5>{{ $t('koejakso-osaamistavoitteet') }}</h5>
            <p>{{ aloituskeskustelu.koejaksonOsaamistavoitteet }}</p>
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
            <p>{{ aloituskeskustelu.erikoistuvanNimi }}</p>
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
          <elsa-button
            :loading="params.saving"
            @click="onSubmit"
            variant="primary"
            class="ml-4 px-5"
          >
            {{ $t('allekirjoita-lähetä') }}
          </elsa-button>
        </b-col>
      </b-row>
    </b-container>

    <b-modal id="return-to-sender" :title="$t('palauta-erikoistuvalle-muokattavaksi')">
      <div class="d-block">
        <b-form>
          <elsa-form-group :label="$t('syy-palautukseen')" :required="true">
            <template v-slot="{ uid }">
              <b-form-textarea
                :id="uid"
                v-model="korjausehdotus"
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
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import { format } from 'date-fns'
  import _get from 'lodash/get'
  import store from '@/store'
  import ElsaButton from '@/components/button/button.vue'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import UserDetails from '@/components/user-details/user-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { LomakeTilat } from '@/utils/constants'

  @Component({
    components: {
      UserDetails,
      ElsaFormGroup,
      ElsaButton
    },
    validations: {
      korjausehdotus: {
        required
      }
    }
  })
  export default class KouluttajaArviointilomakeAloituskeskustelu extends Mixins(validationMixin) {
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
        text: this.$t('aloituskeskustelu-kouluttaja'),
        active: true
      }
    ]

    params = {
      saving: false,
      deleting: false
    }

    loading = true

    korjausehdotus = ''

    validateState(value: string) {
      const form = this.$v
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    hideModal() {
      return this.$bvModal.hide('return-to-sender')
    }

    get aloituskeskusteluId() {
      return Number(this.$route.params.id)
    }

    get koejaksoData() {
      return store.getters['kouluttaja/getAloituskeskustelu'](this.aloituskeskusteluId)
    }

    get aloituskeskustelu() {
      return this.koejaksoData.aloituskeskustelu
    }

    get editable() {
      return (
        !this.aloituskeskustelu.lahiesimies.sopimusHyvaksytty ||
        !this.aloituskeskustelu.lahikouluttaja.sopimusHyvaksytty ||
        this.koejaksoData.aloituskeskustelunTila !== LomakeTilat.PALAUTETTU_KORJATTAVAKSI
      )
    }

    get showSentMsg() {
      return this.koejaksoData.aloituskeskustelunTila !== LomakeTilat.PALAUTETTU_KORJATTAVAKSI
    }

    async returnToSender() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      const form = {
        ...this.aloituskeskustelu,
        korjausehdotus: this.korjausehdotus,
        lahetetty: false
      }
      try {
        await store.dispatch('kouluttaja/putAloituskeskustelu', form)

        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    async updateSentForm() {
      const form = {
        ...this.aloituskeskustelu,
        lahiesimies: {
          sopimusHyvaksytty: true,
          kuittausaika: format(new Date(), 'yyyy-MM-dd')
        }
      }
      try {
        await store.dispatch('kouluttaja/putAloituskeskustelu', form)

        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    onSubmit(params: any) {
      params.saving = true
      this.updateSentForm()
      params.saving = false
    }

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      this.loading = false
    }
  }
</script>

<style lang="scss">
  .textarea-min-height {
    min-height: 100px;
  }
</style>
