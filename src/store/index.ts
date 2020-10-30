import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import auth from "./auth";
import { storeRouteAndRedirectToLogin } from "@/utils/local-storage";

Vue.use(Vuex);
export const ELSA_API_LOCATION =
  process.env.NODE_ENV === "production"
    ? `${location.protocol}//api.${location.hostname}${
        location.port ? ":" + location.port : ""
      }`
    : "";
axios.defaults.baseURL = `${ELSA_API_LOCATION}/api/`;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      storeRouteAndRedirectToLogin();
      location.href = `${ELSA_API_LOCATION}/oauth2/authorization/oidc`;
    }
    return Promise.reject({ ...error });
  }
);

export default new Vuex.Store({
  modules: {
    auth
  }
});
