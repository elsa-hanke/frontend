<template>
  <ArvioinnitErikoistuva v-if="$isErikoistuva()" />
  <ArvioinnitKouluttaja v-else />
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import ArvioinnitErikoistuva from '@/views/arvioinnit-erikoistuva.vue'
  import ArvioinnitKouluttaja from '@/views/arvioinnit-kouluttaja.vue'

  @Component({
    components: {
      ArvioinnitErikoistuva,
      ArvioinnitKouluttaja
    }
  })
  export default class Arvioinnit extends Vue {}
</script>
