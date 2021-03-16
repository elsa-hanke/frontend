import { Route, NavigationGuardNext } from 'vue-router'
import { ELSA_API_LOCATION } from '@/store'

// Palauttaa tallennetun näkymän polun selaimen muistista.
export function restoreRoute(next: NavigationGuardNext) {
  if (typeof localStorage !== 'undefined') {
    try {
      const to = localStorage.getItem('to') as string
      localStorage.removeItem('to')
      try {
        // Ohjataan routerilla jos kyseessä route
        next({
          ...JSON.parse(to),
          replace: true
        })
      } catch (err) {
        // Ohjataan locationilla jos kyseessä href
        window.location.href = to
      }
    } catch (err) {
      console.warn(err)
      next()
    }
  } else {
    next()
  }
}

// Tallentaa näkymän polun selaimen muistiin.
export function storeRoute(to?: Route) {
  if (typeof localStorage !== 'undefined') {
    try {
      if (to) {
        localStorage.setItem(
          'to',
          JSON.stringify({
            path: to.path,
            name: to.name,
            hash: to.hash,
            query: to.query,
            params: to.params,
            meta: to.meta
          })
        )
      } else {
        localStorage.setItem('to', window.location.href)
      }
    } catch (err) {
      console.warn(err)
    }
  }
}

// Tallentaa näkymän polun selaimen muistiin.
export function storeRouteAndRedirectToLogin(to?: Route) {
  storeRoute(to)
  window.location.href = `${ELSA_API_LOCATION}/oauth2/authorization/oidc`
}
