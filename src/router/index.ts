import Vue from 'vue'
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from 'vue-router'
import Meta from 'vue-meta'

import LoginView from '@/views/login/login-view.vue'
import Login from '@/views/login/login.vue'
import Kayttooikeus from '@/views/login/kayttooikeus.vue'
import Arvioinnit from '../views/arvioinnit.vue'
import Arviointi from '../views/arviointi.vue'
import Arviointipyynto from '../views/arviointipyynto.vue'
import ArviointipyyntoLahetetty from '../views/arviointipyynto-lahetetty.vue'
import Asiakirjat from '../views/asiakirjat/asiakirjat.vue'
import Etusivu from '../views/etusivu.vue'
import Itsearviointi from '../views/itsearviointi.vue'
import ItsearviointiValmis from '../views/itsearviointi-valmis.vue'
import Koulutukset from '../views/koulutukset.vue'
import Koulutussuunnitelma from '../views/koulutussuunnitelma.vue'
import MuokkaaArviointia from '../views/muokkaa-arviointia.vue'
import MuokkaaPoissaoloa from '../views/muokkaa-poissaoloa.vue'
import MuokkaaSuoritemerkintaa from '../views/muokkaa-suoritemerkintaa.vue'
import MuokkaaTyoskentelyjaksoa from '../views/muokkaa-tyoskentelyjaksoa.vue'
import PageNotFound from '../views/page-not-found.vue'
import Poissaolo from '../views/poissaolo.vue'
import Root from '../views/root.vue'
import Suoritemerkinnat from '../views/suoritemerkinnat.vue'
import Suoritemerkinta from '../views/suoritemerkinta.vue'
import Tyoskentelyjakso from '../views/tyoskentelyjakso.vue'
import Tyoskentelyjaksot from '../views/tyoskentelyjaksot.vue'
import UusiPoissaolo from '../views/uusi-poissaolo.vue'
import UusiSuoritemerkinta from '../views/uusi-suoritemerkinta.vue'
import UusiTyoskentelyjakso from '../views/uusi-tyoskentelyjakso.vue'
import Viestit from '../views/viestit.vue'
import Koejakso from '../views/koejakso/index.vue'
import KoejaksoContainer from '@/views/koejakso/koejakso-container.vue'
import KoejaksoTavoitteet from '../views/koejakso/erikoistuva/koejakso-tavoitteet.vue'
import ErikoistuvaKoulutussopimus from '../views/koejakso/erikoistuva/koulutussopimus/koulutussopimus.vue'
import ErikoistuvaArviointilomakeAloituskeskustelu from '@/views/koejakso/erikoistuva/arviointilomake-aloituskeskustelu/arviointilomake-aloituskeskustelu.vue'
import KouluttajaKoulutussopimus from '../views/koejakso/kouluttaja/koulutussopimus/kouluttaja-koulutussopimus.vue'
import KouluttajaArviointilomakeAloituskeskustelu from '@/views/koejakso/kouluttaja/arviointilomake-aloituskeskustelu/kouluttaja-arviointilomake-aloituskeskustelu.vue'
import ErikoistuvaArviointilomakeValiarviointi from '@/views/koejakso/erikoistuva/arviointilomake-valiarviointi/arviointilomake-valiarviointi.vue'
import store from '@/store'
import { restoreRoute, storeRoute } from '@/utils/local-storage'

Vue.use(VueRouter)
Vue.use(Meta)

const guard = async (to: Route, from: Route, next: NavigationGuardNext) => {
  await store.dispatch('auth/authorize')

  if (store.getters['auth/isLoggedIn']) {
    // Ohjataan rooliton käyttäjä roolien lisäämisen näkymään kirjautumisen jälkeen
    if (store.getters['auth/account'].authorities.length === 0 && to.name !== 'kayttooikeus') {
      next({
        name: 'kayttooikeus',
        replace: true
      })
    } else {
      restoreRoute(next)
    }
  } else {
    storeRoute(to)
    next('/login')
  }
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'root',
    component: Root,
    beforeEnter: guard,
    redirect: {
      name: 'etusivu'
    },
    children: [
      {
        path: '/etusivu',
        name: 'etusivu',
        meta: {
          grayBackdrop: true
        },
        component: Etusivu
      },
      {
        path: '/koulutussuunnitelma',
        name: 'koulutussuunnitelma',
        component: Koulutussuunnitelma
      },
      {
        path: '/suoritemerkinnat',
        name: 'suoritemerkinnat',
        component: Suoritemerkinnat
      },
      {
        path: '/suoritemerkinnat/uusi',
        name: 'uusi-suoritemerkinta',
        component: UusiSuoritemerkinta
      },
      {
        path: '/suoritemerkinnat/:suoritemerkintaId/muokkaus',
        name: 'muokkaa-suoritemerkintaa',
        component: MuokkaaSuoritemerkintaa
      },
      {
        path: '/suoritemerkinnat/:suoritemerkintaId',
        name: 'suoritemerkinta',
        component: Suoritemerkinta
      },
      {
        path: '/arvioinnit',
        name: 'arvioinnit',
        component: Arvioinnit
      },
      {
        path: '/arvioinnit/arviointipyynto',
        name: 'arviointipyynto',
        component: Arviointipyynto
      },
      {
        path: '/arvioinnit/arviointipyynto/:arviointiId',
        name: 'arviointipyynto-muokkaus',
        component: Arviointipyynto
      },
      {
        path: '/arvioinnit/arviointipyynto-lahetetty',
        name: 'arviointipyynto-lahetetty',
        component: ArviointipyyntoLahetetty
      },
      {
        path: '/arvioinnit/:arviointiId/itsearviointi',
        name: 'itsearviointi',
        component: Itsearviointi
      },
      {
        path: '/arvioinnit/itsearviointi-valmis',
        name: 'itsearviointi-valmis',
        component: ItsearviointiValmis
      },
      {
        path: '/arvioinnit/:arviointiId',
        name: 'arviointi',
        component: Arviointi
      },
      {
        path: '/arvioinnit/:arviointiId/muokkaa',
        name: 'muokkaa-arviointia',
        component: MuokkaaArviointia
      },
      {
        path: '/tyoskentelyjaksot',
        name: 'tyoskentelyjaksot',
        component: Tyoskentelyjaksot
      },
      {
        path: '/tyoskentelyjaksot/uusi',
        name: 'uusi-tyoskentelyjakso',
        component: UusiTyoskentelyjakso
      },
      {
        path: '/tyoskentelyjaksot/:tyoskentelyjaksoId',
        name: 'tyoskentelyjakso',
        component: Tyoskentelyjakso
      },
      {
        path: '/tyoskentelyjaksot/:tyoskentelyjaksoId/muokkaus',
        name: 'muokkaa-tyoskentelyjaksoa',
        component: MuokkaaTyoskentelyjaksoa
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/uusi',
        name: 'uusi-poissaolo',
        component: UusiPoissaolo
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/:poissaoloId',
        name: 'poissaolo',
        component: Poissaolo
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/:poissaoloId/muokkaus',
        name: 'muokkaa-poissaoloa',
        component: MuokkaaPoissaoloa
      },
      {
        path: '/koulutukset',
        name: 'koulutukset',
        component: Koulutukset
      },
      {
        path: '/viestit',
        name: 'viestit',
        component: Viestit
      },
      {
        path: '/asiakirjat',
        name: 'asiakirjat',
        component: Asiakirjat
      },
      {
        path: '/koejakso',
        component: Koejakso,
        children: [
          {
            path: '',
            name: 'koejakso',
            component: KoejaksoContainer
          },
          {
            path: 'koejakso-yleiset-tavoitteet',
            name: 'koejakso-yleiset-tavoitteet',
            component: KoejaksoTavoitteet,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'koulutussopimus',
            name: 'koulutussopimus',
            component: ErikoistuvaKoulutussopimus,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'aloituskeskustelu',
            name: 'koejakson-aloituskeskustelu',
            component: ErikoistuvaArviointilomakeAloituskeskustelu,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'valiarviointi',
            name: 'koejakson-valiarviointi',
            component: ErikoistuvaArviointilomakeValiarviointi,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'koulutussopimus/:id',
            name: 'koulutussopimus-kouluttaja',
            component: KouluttajaKoulutussopimus,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isKouluttaja()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'aloituskeskustelu/:id',
            name: 'aloituskeskustelu-kouluttaja',
            component: KouluttajaArviointilomakeAloituskeskustelu,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isKouluttaja()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: LoginView,
    children: [
      {
        path: '',
        name: 'login',
        component: Login,
        beforeEnter: async (to, from, next) => {
          await store.dispatch('auth/authorize')

          if (store.getters['auth/isLoggedIn']) {
            // Ohjataan rooliton käyttäjä roolien lisäämisen näkymään kirjautumisen jälkeen
            if (
              store.getters['auth/account'].authorities.length === 0 &&
              to.name !== 'kayttooikeus'
            ) {
              next({
                name: 'kayttooikeus',
                replace: true
              })
            } else {
              next('/etusivu')
            }
          } else {
            next()
          }
        }
      },
      {
        path: '/kayttooikeus',
        name: 'kayttooikeus',
        component: Kayttooikeus,
        beforeEnter: async (to, from, next) => {
          await store.dispatch('auth/authorize')

          if (store.getters['auth/isLoggedIn']) {
            if (store.getters['auth/account'].authorities.length > 0) {
              next('/etusivu')
            } else {
              next()
            }
          } else {
            next('/login')
          }
        }
      }
    ]
  },
  {
    path: '*',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
