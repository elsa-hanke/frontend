import { Vue } from "vue-property-decorator";

export function tyoskentelyjaksoLabel(vue: Vue, value: any) {
  return `${value.tyoskentelypaikka.nimi} (${(vue as any).$date(
    value.alkamispaiva
  )} – ${
    value.paattymispaiva
      ? (vue as any).$date(value.paattymispaiva)
      : (vue.$t("kesken") as string).toLowerCase()
  })`;
}
