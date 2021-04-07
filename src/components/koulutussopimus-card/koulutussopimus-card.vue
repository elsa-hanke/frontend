<template>
  <div class="d-flex justify-content-center border rounded pt-3 mb-4">
    <div class="container-fluid sopimus-card-container">
      <h2>{{ $t('koulutussopimus') }}</h2>
      <koulutussopimus-card-content v-if="state === KoulutussopimusTilat.UUSI">
        <template v-slot:content>
          <span class="pr-5" v-html="$t('koulutussopimus-tila-uusi')" />
        </template>
        <template v-slot:button>
          <elsa-button variant="primary" class="mb-4" :to="{ name: 'koulutussopimus' }">
            {{ $t('täytä-koulutussopimus') }}
          </elsa-button>
        </template>
      </koulutussopimus-card-content>

      <koulutussopimus-card-content
        v-if="state === KoulutussopimusTilat.TALLENNETTU_KESKENERAISENA"
      >
        <template v-slot:content>
          <div class="d-inline-flex">
            <font-awesome-icon :icon="['far', 'clock']" class="text-warning mr-1" />
          </div>
          <div class="d-inline-flex">
            <span class="pr-5" v-html="$t('koulutussopimus-tila-tallennettu-keskeneräisenä')" />
          </div>
        </template>
        <template v-slot:button>
          <elsa-button variant="primary" class="mb-4" :to="{ name: 'koulutussopimus' }">
            {{ $t('viimeistele-koulutussopimus') }}
          </elsa-button>
        </template>
      </koulutussopimus-card-content>

      <koulutussopimus-card-content v-if="state === KoulutussopimusTilat.ODOTTAA_HYVAKSYNTAA">
        <template v-slot:content>
          <p class="pr-5" v-html="$t('koulutussopimus-tila-odottaa-hyvaksyntaa')" />
        </template>
        <template v-slot:button>
          <elsa-button variant="primary" class="mb-4" :to="{ name: 'koulutussopimus' }">
            {{ $t('näytä-koulutussopimus') }}
          </elsa-button>
        </template>
      </koulutussopimus-card-content>

      <koulutussopimus-card-content v-if="state === KoulutussopimusTilat.PALAUTETTU_KORJATTAVAKSI">
        <template v-slot:content>
          <div class="d-inline-flex">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-danger mr-1" />
          </div>
          <div class="d-inline-flex">
            <p class="pr-5" v-html="$t('koulutussopimus-tila-palautettu-korjattavaksi')" />
          </div>
        </template>
        <template v-slot:button>
          <elsa-button variant="primary" class="mb-4" :to="{ name: 'koulutussopimus' }">
            {{ $t('viimeistele-koulutussopimus') }}
          </elsa-button>
        </template>
      </koulutussopimus-card-content>

      <koulutussopimus-card-content v-if="state === KoulutussopimusTilat.HYVAKSYTTY">
        <template v-slot:content>
          <div class="d-inline-flex">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-1" />
          </div>
          <div class="d-inline-flex">
            <span class="pr-5" v-html="$t('koulutussopimus-tila-hyvaksytty')" />
          </div>
        </template>
        <template v-slot:button>
          <elsa-button variant="primary" class="mb-4" :to="{ name: 'koulutussopimus' }">
            {{ $t('näytä-koulutussopimus') }}
          </elsa-button>
        </template>
      </koulutussopimus-card-content>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import KoulutussopimusCardContent from './koulutussopimus-card-content.vue'
  import ElsaButton from '@/components/button/button.vue'
  import { KoulutussopimusTilat } from '@/utils/constants'

  @Component({
    components: {
      KoulutussopimusCardContent,
      ElsaButton
    }
  })
  export default class KoulutussopimusCard extends Vue {
    @Prop({ required: false, default: '' })
    state!: string | undefined

    get KoulutussopimusTilat() {
      return KoulutussopimusTilat
    }
  }
</script>
