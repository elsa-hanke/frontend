<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Meta } from '@/utils/decorators'

  @Component({})
  export default class App extends Vue {
    @Meta
    getMetaInfo() {
      if (this.$route && this.$route.name) {
        return {
          title: this.$t(this.$route.name),
          titleTemplate: `%s - ${this.$t('elsa-palvelu')}`
        }
      } else {
        return {
          title: this.$t('elsa-palvelu'),
          titleTemplate: null
        }
      }
    }
  }
</script>
