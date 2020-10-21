import { Route, NavigationGuardNext } from "vue-router";
import { ELSA_API_LOCATION } from "@/store";

/** Palauttaa tallennetun näkymän polun selaimen muistista. */
export function restoreRoute(next: NavigationGuardNext) {
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
}

/** Tallentaa näkymän polun selaimen muistiin. */
export function storeRoute(to: Route) {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(
        "to",
        JSON.stringify({
          path: to.path,
          name: to.name,
          hash: to.hash,
          query: to.query,
          params: to.params,
          meta: to.meta
        })
      );
    } catch (err) {
      console.warn(err);
    }
  }
}

/** Tallentaa näkymän polun selaimen muistiin. */
export function storeRouteAndRedirectToLogin(to: Route) {
  storeRoute(to);
  location.href = `${ELSA_API_LOCATION}/oauth2/authorization/oidc`;
}
