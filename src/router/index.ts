import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Meta from "vue-meta";
import Arvioinnit from "../views/arvioinnit.vue";
import Arviointi from "../views/arviointi.vue";
import Arviointipyynto from "../views/arviointipyynto.vue";
import ArviointipyyntoLahetetty from "../views/arviointipyynto-lahetetty.vue";
import Asiakirjat from "../views/asiakirjat.vue";
import Etusivu from "../views/etusivu.vue";
import Itsearviointi from "../views/itsearviointi.vue";
import Koulutukset from "../views/koulutukset.vue";
import Koulutussuunnitelma from "../views/koulutussuunnitelma.vue";
import Login from "../views/login.vue";
import PageNotFound from "../views/page-not-found.vue";
import Root from "../views/root.vue";
import Tyoskentelyjaksot from "../views/tyoskentelyjaksot.vue";
import Viestit from "../views/viestit.vue";

Vue.use(VueRouter);
Vue.use(Meta);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "root",
    component: Root,
    redirect: { name: "etusivu" },
    children: [
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
        path: "/arvioinnit/arviointipyynto",
        name: "arviointipyynto",
        component: Arviointipyynto
      },
      {
        path: "/arvioinnit/arviointipyynto-lahetetty",
        name: "arviointipyynto-lahetetty",
        component: ArviointipyyntoLahetetty
      },
      {
        path: "/arvioinnit/itsearviointi",
        name: "itsearviointi",
        component: Itsearviointi
      },
      {
        path: "/arvioinnit/:id",
        name: "arviointi",
        component: Arviointi
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
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "*",
    component: PageNotFound
  }
];

const router = new VueRouter({
  mode: "hash", // todo: history
  base: process.env.BASE_URL,
  routes
});

export default router;
