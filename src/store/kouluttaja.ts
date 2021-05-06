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
      try {
        return await api.putKoulutussopimus(koulutussopimusLomake).then((res) => {
          if (res.status === 201) {
            commit('formSuccess')
            dispatch('getKoejaksot')
          }
        })
      } catch (err) {
        commit('formError')
      }
    }
  },
  getters: {
    status: (state) => state.status,
    koejaksot: (state) => state.koejaksot,
    getKoulutussopimus: (state) => (id: number) => {
      if (state.koejaksot) {
        return state.koejaksot.find((koejakso: Koejakso) => koejakso.koulutussopimus.id === id)
      }
    }
  }
}

export default kouluttaja
