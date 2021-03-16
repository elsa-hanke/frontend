<template>
  <div class="d-flex-column">
    <b-row>
      <b-col>
        <p v-html="$t('koulutussopimus-tila-2')" class="pr-5" />
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
  export default class SopimusState2 extends Vue {}
</script>
