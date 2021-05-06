import { Module } from 'vuex'
import * as api from '@/api/erikoistuva'

const erikoistuva: Module<any, any> = {
  namespaced: true,
  state: {
    status: '',
    koejakso: null,
    kouluttajat: null
  },
  mutations: {
    koejaksoRequest(state) {
      state.status = 'loading'
    },
    koejaksoSuccess(state, koejakso) {
      state.status = 'success'
      state.koejakso = koejakso
    },
    koejaksoError(state) {
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
    },
    kouluttajatRequest(state) {
      state.status = 'loading'
    },
    kouluttajatSuccess(state, kouluttajat) {
      state.status = 'success'
      state.kouluttajat = kouluttajat
    },
    kouluttajatError(state) {
      state.status = 'error'
    }
  },
  actions: {
    async getKoejakso({ commit }) {
      commit('koejaksoRequest')
      try {
        const { data } = await api.getKoejakso()
        commit('koejaksoSuccess', data)
      } catch (err) {
        commit('koejaksoError')
      }
    },
    async postKoulutussopimus({ dispatch, commit }, koulutussopimusLomake) {
      commit('formRequest')
      try {
        return await api.postKoulutussopimus(koulutussopimusLomake).then((res) => {
          if (res.status === 201) {
            commit('formSuccess')
            dispatch('getKoejakso')
          }
        })
      } catch (err) {
        commit('formError')
      }
    },
    async putKoulutussopimus({ dispatch, commit }, koulutussopimusLomake) {
      commit('formRequest')
      try {
        return await api.putKoulutussopimus(koulutussopimusLomake).then((res) => {
          if (res.status === 201) {
            commit('formSuccess')
            dispatch('getKoejakso')
          }
        })
      } catch (err) {
        commit('formError')
      }
    },
    async postAloituskeskustelu({ dispatch, commit }, aloituskeskusteluLomake) {
      commit('formRequest')
      try {
        return await api.postAloituskeskustelu(aloituskeskusteluLomake).then((res) => {
          if (res.status === 201) {
            commit('formSuccess')
            dispatch('getKoejakso')
          }
        })
      } catch (err) {
        commit('formError')
      }
    },
    async putAloituskeskustelu({ dispatch, commit }, aloituskeskusteluLomake) {
      commit('formRequest')
      try {
        return await api.putAloituskeskustelu(aloituskeskusteluLomake).then((res) => {
          if (res.status === 201) {
            commit('formSuccess')
            dispatch('getKoejakso')
          }
        })
      } catch (err) {
        commit('formError')
      }
    },
    async getKouluttajat({ commit }) {
      commit('kouluttajatRequest')
      try {
        const { data } = await api.getKouluttajat()
        commit('kouluttajatSuccess', data)
      } catch (err) {
        commit('kouluttajatError')
      }
    }
  },
  getters: {
    status: (state) => state.status,
    koejakso: (state) => state.koejakso,
    kouluttajat: (state) => state.kouluttajat
  }
}

export default erikoistuva
