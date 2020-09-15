import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Meta from "vue-meta";
import Etusivu from "../views/Etusivu.vue";
import Koulutussuunnitelma from "../views/Koulutussuunnitelma.vue";
import Arvioinnit from "../views/Arvioinnit.vue";
import Tyoskentelyjaksot from "../views/Tyoskentelyjaksot.vue";
import Koulutukset from "../views/Koulutukset.vue";
import Viestit from "../views/Viestit.vue";
import Asiakirjat from "../views/Asiakirjat.vue";

Vue.use(VueRouter);
Vue.use(Meta);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "root",
    redirect: { name: "etusivu" }
  },
  {
    path: "/etusivu",
    name: "etusivu",
    component: Etusivu
  },
  {
    path: "/koulutussuunnitelma",
    name: "koulutussuunnitelma",
    component: Koulutussuunnitelma
  },
  {
    path: "/arvioinnit",
    name: "arvioinnit",
    component: Arvioinnit
  },
  {
    path: "/tyoskentelyjaksot",
    name: "tyoskentelyjaksot",
    component: Tyoskentelyjaksot
  },
  {
    path: "/koulutukset",
    name: "koulutukset",
    component: Koulutukset
  },
  {
    path: "/viestit",
    name: "viestit",
    component: Viestit
  },
  {
    path: "/asiakirjat",
    name: "asiakirjat",
    component: Asiakirjat
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
