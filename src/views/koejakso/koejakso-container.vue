<template>
  <div class="koejakso-container">
    <koejakso-view-erikoistuva v-if="$isErikoistuva()"></koejakso-view-erikoistuva>
    <koejakso-view-kouluttaja v-if="$isKouluttaja()"></koejakso-view-kouluttaja>

    <b-container v-if="notFound">
      <p>{{ $t('sivua-ei-loydy') }}</p>
    </b-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import KoejaksoViewKouluttaja from '@/views/koejakso/kouluttaja/koejakso-view-kouluttaja.vue'
  import KoejaksoViewErikoistuva from '@/views/koejakso/erikoistuva/koejakso-view-erikoistuva.vue'

  @Component({
    components: {
      KoejaksoViewKouluttaja,
      KoejaksoViewErikoistuva
    }
  })
  export default class KoejaksoContainer extends Vue {
    get notFound() {
      return !(this.$isErikoistuva() || this.$isKouluttaja())
    }
  }
</script>

<style lang="scss">
  .koejakso-container {
    max-width: 1024px;
  }
</style>
