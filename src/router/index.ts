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
import ItsearviointiValmis from "../views/itsearviointi-valmis.vue";
import Kayttooikeus from "../views/kayttooikeus.vue";
import Koulutukset from "../views/koulutukset.vue";
import Koulutussuunnitelma from "../views/koulutussuunnitelma.vue";
import MuokkaaSuoritemerkintaa from "../views/muokkaa-suoritemerkintaa.vue";
import MuokkaaTyoskentelyjaksoa from "../views/muokkaa-tyoskentelyjaksoa.vue";
import PageNotFound from "../views/page-not-found.vue";
import Root from "../views/root.vue";
import Suoritemerkinnat from "../views/suoritemerkinnat.vue";
import Suoritemerkinta from "../views/suoritemerkinta.vue";
import Tyoskentelyjakso from "../views/tyoskentelyjakso.vue";
import Tyoskentelyjaksot from "../views/tyoskentelyjaksot.vue";
import UusiPoissaolo from "../views/uusi-poissaolo.vue";
import UusiSuoritemerkinta from "../views/uusi-suoritemerkinta.vue";
import UusiTyoskentelyjakso from "../views/uusi-tyoskentelyjakso.vue";
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
        meta: {
          grayBackdrop: true
        },
        component: Etusivu
      },
      {
        path: "/koulutussuunnitelma",
        name: "koulutussuunnitelma",
        component: Koulutussuunnitelma
      },
      {
        path: "/suoritemerkinnat",
        name: "suoritemerkinnat",
        component: Suoritemerkinnat
      },
      {
        path: "/suoritemerkinnat/uusi",
        name: "uusi-suoritemerkinta",
        component: UusiSuoritemerkinta
      },
      {
        path: "/suoritemerkinnat/:suoritemerkintaId/muokkaus",
        name: "muokkaa-suoritemerkintaa",
        component: MuokkaaSuoritemerkintaa
      },
      {
        path: "/suoritemerkinnat/:suoritemerkintaId",
        name: "suoritemerkinta",
        component: Suoritemerkinta
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
        path: "/arvioinnit/arviointipyynto/:arviointiId",
        name: "arviointipyynto-muokkaus",
        component: Arviointipyynto
      },
      {
        path: "/arvioinnit/arviointipyynto-lahetetty",
        name: "arviointipyynto-lahetetty",
        component: ArviointipyyntoLahetetty
      },
      {
        path: "/arvioinnit/:arviointiId/itsearviointi",
        name: "itsearviointi",
        component: Itsearviointi
      },
      {
        path: "/arvioinnit/itsearviointi-valmis",
        name: "itsearviointi-valmis",
        component: ItsearviointiValmis
      },
      {
        path: "/arvioinnit/:arviointiId",
        name: "arviointi",
        component: Arviointi
      },
      {
        path: "/tyoskentelyjaksot",
        name: "tyoskentelyjaksot",
        component: Tyoskentelyjaksot
      },
      {
        path: "/tyoskentelyjaksot/uusi",
        name: "uusi-tyoskentelyjakso",
        component: UusiTyoskentelyjakso
      },
      {
        path: "/tyoskentelyjaksot/:tyoskentelyjaksoId",
        name: "tyoskentelyjakso",
        component: Tyoskentelyjakso
      },
      {
        path: "/tyoskentelyjaksot/:tyoskentelyjaksoId/muokkaus",
        name: "muokkaa-tyoskentelyjaksoa",
        component: MuokkaaTyoskentelyjaksoa
      },
      {
        path: "/tyoskentelyjaksot/poissaolot/uusi",
        name: "uusi-poissaolo",
        component: UusiPoissaolo
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
    path: "/kayttooikeus",
    name: "kayttooikeus",
    component: Kayttooikeus
  },
  {
    path: "*",
    component: PageNotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
