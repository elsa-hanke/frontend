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

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
