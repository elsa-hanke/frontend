import { Module } from "vuex";
import axios from "axios";

const auth: Module<any, any> = {
  state: {
    status: "",
    account: null,
    loggedIn: false
  },
  mutations: {
    authRequest(state) {
      state.status = "loading";
    },
    authSuccess(state, account) {
      state.status = "success";
      state.account = account;
      state.loggedIn = true;
    },
    authError(state) {
      state.status = "error";
      state.loggedIn = false;
    },
    logoutRequest(state) {
      state.status = "loading";
      state.loggedIn = false;
    },
    logoutSuccess(state) {
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
        const account = (await axios.get("account")).data;
        commit("authSuccess", account);
      } catch (err) {
        commit("authError");
      }
    },
    async logout({ commit }) {
      commit("logoutRequest");
      try {
        const logoutDetails = (await axios.post("logout", {})).data;
        commit("logoutSuccess");
        window.location.href = `${logoutDetails.logoutUrl}?redirect_uri=${location.origin}/`;
      } catch (err) {
        commit("logoutError");
        window.location.reload();
      }
    }
  },
  getters: {
    status: state => state.status,
    account: state => state.account,
    isLoggedIn: state => state.loggedIn
  }
};

export default auth;
