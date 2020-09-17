import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    account: null,
    login: null
  },
  mutations: {
    authRequest(state) {
      state.status = "loading";
    },
    authSuccess(state, account) {
      state.status = "success";
      state.account = account;
    },
    authError(state) {
      state.status = "error";
      state.account = null;
    },
    loginRequest(state) {
      state.status = "loading";
    },
    loginSuccess(state, login) {
      state.login = login;
    },
    loginError(state) {
      state.status = "error";
    },
    logoutRequest(state) {
      state.status = "loading";
    },
    logoutSuccess(state) {
      state.account = null;
      state.login = null;
      state.status = "success";
    },
    logoutError(state) {
      state.status = "error";
    }
  },
  actions: {
    async authorize({ commit }) {
      commit("authRequest");
      try {
        const account = (await axios.get("services/uaa/api/account")).data;
        commit("authSuccess", account);
      } catch (err) {
        commit("authError");
      }
    },
    async login({ commit, dispatch }, form) {
      commit("loginRequest");
      try {
        const login = (await axios.post("auth/login", form)).data;
        commit("loginSuccess", login);
        await dispatch("authorize");
      } catch (err) {
        commit("loginError");
      }
    },
    async logout({ commit }) {
      commit("logoutRequest");
      try {
        await axios.post("auth/logout");
        commit("logoutSuccess");
      } catch (err) {
        commit("logoutError");
      }
    }
  },
  getters: {
    isLoggedIn: state => !!state.account,
    status: state => state.status,
    account: state => state.account
  }
});
