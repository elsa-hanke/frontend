import '@babel/polyfill'
import 'mutationobserver-shim'
import '@/plugins/registerComponentHooks'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
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

Vue.use(Vuelidate)
Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  await store.dispatch('auth/authorize')
  if (store.getters['auth/isLoggedIn']) {
    // Ohjataan rooliton käyttäjä roolien lisäämisen näkymään kirjautumisen jälkeen
    if (store.getters['auth/account'].authorities.length === 0 && to.name !== 'kayttooikeus') {
      next({
        name: 'kayttooikeus',
        replace: true
      })
    }

    restoreRoute(next)
  } else {
    if (store.getters['auth/status'] === 'error') {
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
  render: (h) => h(App)
}).$mount('#app')
