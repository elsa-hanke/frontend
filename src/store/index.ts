import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import auth from "./auth";

Vue.use(Vuex);
export const ELSA_API_LOCATION =
  process.env.NODE_ENV === "production"
    ? `${location.protocol}//api.${location.hostname}${
        location.port ? ":" + location.port : ""
      }`
    : "";
axios.defaults.baseURL = `${ELSA_API_LOCATION}/api/`;

export default new Vuex.Store({
  modules: {
    auth
  }
});
