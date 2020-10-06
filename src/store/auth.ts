import { Module } from "vuex";
import axios from "axios";

const authModule: Module<any, any> = {
  state: {
    status: "",
    account: null
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
      //state.account = null;
    },
    logoutRequest(state) {
      state.status = "loading";
    },
    logoutSuccess(state) {
      //state.account = null;
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
      }
    }
  },
  getters: {
    isLoggedIn: state => !!state.account,
    status: state => state.status,
    account: state => state.account
  }
};

export default authModule;
