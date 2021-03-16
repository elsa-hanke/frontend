<template>
  <div class="koulutukset">
    {{ $t('koulutukset') }}
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component({
    components: {}
  })
  export default class Koulutukset extends Vue {}
</script>
