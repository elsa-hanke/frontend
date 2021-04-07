<template>
  <div class="itsearviointi">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <b-card-skeleton
            :loading="false"
            class="mb-3 itsearviointi-card"
            :header="$t('tee-itsearviointi')"
          >
            Käyttäjäprofiili - oma rooli - opiskeluoikeudet
          </b-card-skeleton>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import BCardSkeleton from '@/components/card/card.vue'

  @Component({
    components: {
      BCardSkeleton
    }
  })
  export default class Kayttajaprofiili extends Vue {}
</script>
