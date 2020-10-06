import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/filters";
import "./plugins/bootstrap-vue";
import i18n from "./plugins/i18n";
import "./configs/fontawesome";
import App from "./app.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

router.beforeEach(async (to, from, next) => {
  if (to.matched.length > 0 && to.matched[0].name === "login") {
    if (store.getters.isLoggedIn) {
      next("/");
    } else {
      next();
    }
  }
  await store.dispatch("authorize");
  if (store.getters.isLoggedIn) {
    next();
  } else {
    location.href = `${location.origin}/oauth2/authorization/oidc`;
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
