import Vue from 'vue'
import store from '@/store'
import { ELSA_ROLE } from '@/utils/roles'

export class RolesPlugin {
  public install(vue: typeof Vue) {
    vue.prototype.$isErikoistuva = function (): boolean {
      return store.getters.account.authorities.includes(ELSA_ROLE.ErikoistuvaLaakari)
    }

    vue.prototype.$isKouluttaja = function () {
      return store.getters.account.authorities.includes(ELSA_ROLE.Kouluttaja)
    }
  }
}

Vue.use(new RolesPlugin())
