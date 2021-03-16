import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import '@/plugins/composition-api'
import '@/plugins/filters'
import '@/plugins/bootstrap-vue'
import '@/plugins/date'
import '@/plugins/apexcharts'
import i18n from '@/plugins/i18n'
import '@/plugins/fontawesome'
import '@/plugins/roles'
import App from '@/app.vue'
import router from '@/router'
import store from '@/store'
import { storeRouteAndRedirectToLogin, restoreRoute } from '@/utils/local-storage'

import '@/styles/app.scss'

Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  await store.dispatch('authorize')
  if (store.getters.isLoggedIn) {
    // Ohjataan rooliton käyttäjä roolien lisäämisen näkymään kirjautumisen jälkeen
    if (store.getters.account.authorities.length === 0 && to.name !== 'kayttooikeus') {
      next({
        name: 'kayttooikeus',
        replace: true
      })
    }

    restoreRoute(next)
  } else {
    if (store.getters.status === 'error') {
      // TODO: virhesivu
    } else {
      storeRouteAndRedirectToLogin(to)
    }
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
