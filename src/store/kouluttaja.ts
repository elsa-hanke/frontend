import { Module } from 'vuex'
import * as api from '@/api/kouluttaja'
import { Koejakso } from '@/types'

const kouluttaja: Module<any, any> = {
  namespaced: true,
  state: {
    status: '',
    koejaksot: null
  },
  mutations: {
    koejaksotRequest(state) {
      state.status = 'loading'
    },
    koejaksotSuccess(state, koejaksot) {
      state.status = 'success'
      state.koejaksot = koejaksot
    },
    koejaksotError(state) {
      state.status = 'error'
    },
    formRequest(state) {
      state.status = 'loading'
    },
    formSuccess(state) {
      state.status = 'success'
    },
    formError(state) {
      state.status = 'error'
    }
  },
  actions: {
    async getKoejaksot({ commit }) {
      commit('koejaksotRequest')
      try {
        const { data } = await api.getKoejaksot()
        commit('koejaksotSuccess', data)
      } catch (err) {
        commit('koejaksotError')
      }
    },
    async putKoulutussopimus({ commit, dispatch }, koulutussopimusLomake) {
      commit('formRequest')
      return new Promise((resolve, reject) => {
        api
          .putKoulutussopimus(koulutussopimusLomake)
          .then((response) => {
            commit('formSuccess')
            dispatch('getKoejaksot')
            resolve(response)
          })
          .catch((error) => {
            commit('formError')
            reject(error)
          })
      })
    },
    async putAloituskeskustelu({ commit, dispatch }, aloituskeskusteluLomake) {
      commit('formRequest')
      return new Promise((resolve, reject) => {
        api
          .putAloituskeskustelu(aloituskeskusteluLomake)
          .then((response) => {
            commit('formSuccess')
            dispatch('getKoejaksot')
            resolve(response)
          })
          .catch((error) => {
            commit('formError')
            reject(error)
          })
      })
    }
  },
  getters: {
    status: (state) => state.status,
    koejaksot: (state) => state.koejaksot,
    getKoulutussopimus: (state) => (id: number) => {
      if (state.koejaksot) {
        return state.koejaksot.find((koejakso: Koejakso) => koejakso.koulutussopimus.id === id)
      }
    },
    getAloituskeskustelu: (state) => (id: number) => {
      if (state.koejaksot) {
        return state.koejaksot.find((koejakso: Koejakso) => koejakso.aloituskeskustelu.id === id)
      }
    }
  }
}

export default kouluttaja
