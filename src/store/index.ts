import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import auth from "./auth";

Vue.use(Vuex);
axios.defaults.baseURL = "/api/";

export default new Vuex.Store({
  modules: {
    auth
  }
});
