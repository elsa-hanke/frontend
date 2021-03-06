<template>
  <b-form @submit.stop.prevent="onSubmit">
    <b-row>
      <b-col lg="4">
        <elsa-form-group :label="$t('opinto-oikeuden-alkamispäivä')" :required="true">
          <template v-slot="{ uid }">
            <elsa-form-datepicker
              :id="uid"
              v-model="form.opintooikeudenMyontamispaiva"
              :state="validateState('opintooikeudenMyontamispaiva')"
              :max="opintooikeudenPaattymispaiva"
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="4">
        <elsa-form-group :label="$t('koejakson-alkamispäivä')" :required="true">
          <template #label-help>
            <elsa-popover>
              <template>
                <h3>{{ $t('koejakson-alkamispäivä') }}</h3>
                <p>{{ $t('koejakson-alkamis-tooltip') }}</p>
              </template>
            </elsa-popover>
          </template>
          <template v-slot="{ uid }">
            <elsa-form-datepicker
              :id="uid"
              v-model="form.koejaksonAlkamispaiva"
              :state="validateState('koejaksonAlkamispaiva')"
              :min="opintooikeudenMyontamispaiva"
              :max="koejaksonPaattymispaiva"
              :disabled="!form.opintooikeudenMyontamispaiva"
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="5">
        <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.erikoistuvanSahkoposti"
              :state="validateState('erikoistuvanSahkoposti')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
      <b-col lg="3">
        <elsa-form-group :label="$t('puhelin-virka-aikaan')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.erikoistuvanPuhelinnumero"
              :state="validateState('erikoistuvanPuhelinnumero')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col>
        <h3>{{ $t('koulutuspaikan-tiedot') }}</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="8">
        <koulutuspaikka-details
          v-for="(koulutuspaikka, index) in form.koulutuspaikat"
          :key="index"
          :koulutuspaikka="koulutuspaikka"
          v-model="form.koulutuspaikat"
        ></koulutuspaikka-details>
        <elsa-button
          v-if="form.koulutuspaikat.length >= 2"
          @click="deleteKoulutuspaikka"
          variant="outline-primary"
          class="border-0 p-0"
        >
          <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
          {{ $t('poista-toimipaikka') }}
        </elsa-button>
        <elsa-button
          v-else
          @click="addKoulutuspaikka"
          variant="outline-primary"
          class="border-0 p-0"
        >
          + {{ $t('toinen-toimipaikka') }}
        </elsa-button>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col lg="8">
        <h3>{{ $t('koulutuspaikan-lahikouluttaja') }}</h3>
        <kouluttaja-details
          v-for="(k, index) in form.kouluttajat"
          :key="index"
          :index="index"
          :kouluttaja="k"
          :kouluttajat="kouluttajatList"
          @kouluttajaSelected="selectKouluttaja"
        ></kouluttaja-details>

        <elsa-button
          v-if="form.kouluttajat.length >= 2"
          @click="deleteKouluttaja"
          variant="outline-primary"
          class="border-0 p-0"
        >
          <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
          {{ $t('lahikouluttaja-poista') }}
        </elsa-button>
        <elsa-button v-else @click="addKouluttaja" variant="outline-primary" class="border-0 p-0">
          + {{ $t('lahikouluttaja-toinen') }}
        </elsa-button>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col lg="8">
        <h3>{{ $t('erikoisala-vastuuhenkilö') }}</h3>
        <elsa-form-group :label="$t('erikoisala-vastuuhenkilö-label')" :required="true">
          <template v-slot="{ uid }">
            <b-form-radio-group
              :id="uid"
              v-model="selected.vastuuhenkilo"
              :state="validateState('vastuuhenkilo')"
              name="erikoisalan-vastuuhenkilo"
              stacked
              @change="updateVastuuhenkilo"
            >
              <b-form-radio v-for="(v, index) in vastuuhenkilot" :value="v.id" :key="index">
                {{ v.nimi }}, {{ v.nimike }}
              </b-form-radio>
            </b-form-radio-group>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col>
        <elsa-button v-if="editable" variant="outline-primary" @click="saveAndExit">
          {{ $t('tallenna-keskeneraisena') }}
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
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Prop, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'
  import { Kouluttaja, KoulutussopimusLomake, UserAccount } from '@/types'
  import _get from 'lodash/get'
  import { defaultKouluttaja, defaultKoulutuspaikka, vastuuhenkilot } from '@/utils/constants'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import KoulutuspaikkaDetails from '@/views/koejakso/erikoistuva/koulutussopimus/koulutuspaikka-details.vue'
  import KouluttajaDetails from '@/views/koejakso/erikoistuva/koulutussopimus/kouluttaja-details.vue'

  @Component({
    components: {
      KoulutuspaikkaDetails,
      KouluttajaDetails,
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaButton,
      ElsaPopover
    },
    validations: {
      form: {
        opintooikeudenMyontamispaiva: {
          required
        },
        koejaksonAlkamispaiva: {
          required
        },
        erikoistuvanSahkoposti: {
          required,
          email
        },
        erikoistuvanPuhelinnumero: {
          required
        },
        vastuuhenkilo: {
          required
        }
      }
    }
  })
  export default class KoulutussopimusForm extends Mixins(validationMixin) {
    @Prop({ required: true, default: {} })
    data!: KoulutussopimusLomake

    @Prop({ required: true, default: {} })
    account!: UserAccount

    @Prop({ required: false, default: () => [] })
    kouluttajat!: Kouluttaja[]

    @Prop({ required: true })
    editable!: boolean

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
      kouluttajat: [defaultKouluttaja],
      koulutuspaikat: [defaultKoulutuspaikka],
      lahetetty: false,
      muokkauspaiva: '',
      opintooikeudenMyontamispaiva: '',
      vastuuhenkilo: null
    }
    selected: any = {
      vastuuhenkilo: null
    }
    params = {
      saving: false,
      deleting: false
    }

    validateState(value: string) {
      const form = this.$v.form
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    get opintooikeudenMyontamispaiva() {
      return this.form?.opintooikeudenMyontamispaiva
    }

    get opintooikeudenPaattymispaiva() {
      return ''
    }

    get koejaksonPaattymispaiva() {
      return ''
    }

    get vastuuhenkilot() {
      return vastuuhenkilot
    }

    addKoulutuspaikka() {
      this.form.koulutuspaikat.push(defaultKoulutuspaikka)
    }

    deleteKoulutuspaikka() {
      this.form.koulutuspaikat.pop()
    }

    selectKouluttaja(kouluttaja: Kouluttaja, index: number) {
      Vue.set(this.form.kouluttajat, index, kouluttaja)
    }

    addKouluttaja() {
      this.form.kouluttajat.push(defaultKouluttaja)
    }

    deleteKouluttaja() {
      this.form.kouluttajat.pop()
    }

    get kouluttajatList() {
      const selectedKouluttajat =
        this.form.kouluttajat[0].kayttajaId !== null
          ? this.form.kouluttajat.map((k) => k.kayttajaId)
          : null

      return this.kouluttajat.map((k) => {
        if (selectedKouluttajat?.includes(k.id)) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    updateVastuuhenkilo(id: number) {
      const hloId = this.vastuuhenkilot.find((a) => (a.id = id))
      if (hloId) this.form.vastuuhenkilo = hloId
    }

    saveAndExit() {
      this.$emit('saveAndExit', this.form, this.params)
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.$emit('submit', this.form, this.params)
    }

    mounted(): void {
      if (this.data !== null) {
        this.form = this.data
        this.selected.vastuuhenkilo = this.data.vastuuhenkilo?.id
      }

      this.form.erikoistuvanNimi = this.account.firstName.concat(' ', this.account.lastName)

      if (!this.form.erikoistuvanSahkoposti) {
        this.form.erikoistuvanSahkoposti = this.account.email
      }
    }
  }
</script>
