import axios from "axios";
import { Component, Vue, Prop } from "vue-property-decorator";
import { tyoskentelyjaksoLabel } from "@/utils/tyoskentelyjakso";
import { toastSuccess, toastFail } from "@/utils/toast";
import { dateBetween } from "@/utils/date";

@Component({})
export default class TyoskentelyjaksoMixin extends Vue {
  @Prop({ required: false, default: [] })
  tyoskentelyjaksot!: any[];

  form = {
    tyoskentelyjakso: null,
    tapahtumanAjankohta: null
  } as any;

  onTyoskentelyjaksoSelect(value: any) {
    if (
      !dateBetween(
        this.form.tapahtumanAjankohta,
        value.alkamispaiva,
        value.paattymispaiva
      )
    ) {
      this.form.tapahtumanAjankohta = null;
    }
  }

  async onTyoskentelyjaksoSubmit(value: any, modal: any) {
    try {
      const tyoskentelyjakso = (
        await axios.post("/erikoistuva-laakari/tyoskentelyjaksot", value)
      ).data;
      this.tyoskentelyjaksot.push(tyoskentelyjakso);
      tyoskentelyjakso.label = tyoskentelyjaksoLabel(this, tyoskentelyjakso);
      this.form.tyoskentelyjakso = tyoskentelyjakso;
      this.onTyoskentelyjaksoSelect(tyoskentelyjakso);
      modal.hide("confirm");
      toastSuccess(this, this.$t("uusi-tyoskentelyjakso-lisatty"));
    } catch (err) {
      toastFail(
        this,
        this.$t("uuden-tyoskentelyjakson-lisaaminen-epaonnistui")
      );
    }
  }

  get tyoskentelyjaksotFormatted() {
    return this.tyoskentelyjaksot.map(tj => ({
      ...tj,
      label: tyoskentelyjaksoLabel(this, tj)
    }));
  }

  get tyoskentelyjaksonAlkamispaiva() {
    return this.form.tyoskentelyjakso?.alkamispaiva;
  }

  get tyoskentelyjaksonPaattymispaiva() {
    return this.form.tyoskentelyjakso?.paattymispaiva;
  }
}
