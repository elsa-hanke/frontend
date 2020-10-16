import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/filters";
import "./plugins/bootstrap-vue";
import i18n from "./plugins/i18n";
import "./configs/fontawesome";
import App from "./app.vue";
import router from "./router";
import store, { ELSA_API_LOCATION } from "./store";

import "@/styles/app.scss";

Vue.config.productionTip = false;

router.beforeEach(async (to, from, next) => {
  await store.dispatch("authorize");
  if (store.getters.isLoggedIn) {
    if (typeof localStorage !== "undefined") {
      try {
        const to = localStorage.getItem("to") as string;
        localStorage.removeItem("to");
        next({
          ...JSON.parse(to),
          replace: true
        });
      } catch (err) {
        console.warn(err);
      }
    }
    next();
  } else {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("to", JSON.stringify(to));
      } catch (err) {
        console.warn(err);
      }
    }
    location.href = `${ELSA_API_LOCATION}/oauth2/authorization/oidc`;
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
