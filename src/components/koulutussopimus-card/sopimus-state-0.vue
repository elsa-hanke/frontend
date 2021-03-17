<template>
  <div class="d-flex-column sopimus-card-container">
    <b-row class="mb-3">
      <b-col>
        <span class="pr-5" v-html="$t('koulutussopimus-tila-0')" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ElsaButton variant="primary" class="mb-4">
          {{ $t('täytä-koulutussopimus') }}
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
  export default class SopimusState0 extends Vue {}
</script>

<style lang="scss" scoped>
  .sopimus-card-container {
    &:hover {
      cursor: pointer;
    }
  }
</style>
