import { Vue } from "vue-property-decorator";
import {
  tyoskentelypaikkaTyypit,
  tyoskentelyjaksoKaytannonKoulutusTyypit
} from "@/utils/constants";

export function tyoskentelyjaksoLabel(vue: Vue, value: any) {
  return `${value.tyoskentelypaikka.nimi} (${(vue as any).$date(
    value.alkamispaiva
  )} – ${
    value.paattymispaiva
      ? (vue as any).$date(value.paattymispaiva)
      : (vue.$t("kesken") as string).toLowerCase()
  })`;
}

export function tyoskentelypaikkaTyyppiLabel(vue: Vue, value: string) {
  return vue.$t(tyoskentelypaikkaTyypit[value]);
}

export function tyoskentelyjaksoKaytannonKoulutusLabel(
  vue: Vue,
  value: string
) {
  return vue.$t(tyoskentelyjaksoKaytannonKoulutusTyypit[value]);
}
