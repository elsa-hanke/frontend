import { Vue } from "vue-property-decorator";

export async function confimExit(vue: Vue) {
  return vue.$bvModal.msgBoxConfirm(
    vue.$t("tallentamattomia-tietoja-vahvistus") as string,
    {
      title: vue.$t("vahvista-poistuminen-tallentamatta") as string,
      okVariant: "danger",
      okTitle: vue.$t("poistu-tallentamatta") as string,
      cancelTitle: vue.$t("peruuta") as string,
      hideHeaderClose: false,
      centered: true
    }
  );
}
