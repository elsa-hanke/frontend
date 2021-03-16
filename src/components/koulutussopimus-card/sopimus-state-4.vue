<template>
  <div class="d-flex-column">
    <b-row class="mb-3">
      <b-col>
        <div class="d-inline-flex">
          <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-1" />
        </div>
        <div class="d-inline-flex">
          <span v-html="$t('koulutussopimus-tila-4')" class="pr-5" />
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ElsaButton variant="primary" class="mb-4">
          {{ $t('näytä-koulutussopimus') }}
        </ElsaButton>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ElsaButton
    }
  })
  export default class SopimusState4 extends Vue {}
</script>
