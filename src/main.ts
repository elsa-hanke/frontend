import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "@/plugins/filters";
import "@/plugins/bootstrap-vue";
import i18n from "@/plugins/i18n";
import "@/configs/fontawesome";
import App from "@/app.vue";
import router from "@/router";
import store from "@/store";
import {
  storeRouteAndRedirectToLogin,
  restoreRoute
} from "@/utils/local-storage";

import "@/styles/app.scss";

Vue.config.productionTip = false;

router.beforeEach(async (to, from, next) => {
  await store.dispatch("authorize");
  if (store.getters.isLoggedIn) {
    restoreRoute(next);
  } else {
    storeRouteAndRedirectToLogin(to);
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
