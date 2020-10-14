<template>
  <b-form-group :label-for="labelFor"
    ><template v-slot:label
      ><div class="d-flex justify-content-between align-items-center flex-wrap">
        <div class="text-nowrap" :class="{ 'mr-3': addNew }">
          {{ label }}
          <span class="text-primary" v-if="required">*</span>
        </div>
        <div class="text-muted form-group-help" v-if="addNew">
          <font-awesome-layers fixed-width class="mr-1">
            <font-awesome-icon fixed-width :icon="['far', 'circle']" />
            <font-awesome-icon fixed-width icon="info" transform="shrink-8" />
          </font-awesome-layers>
          <b-link @click="$refs[modalRef].show()">{{ addNewLabelText }}</b-link
          ><b-modal :ref="modalRef" centered @hide="hideConfirm" size="lg">
            <template v-slot:modal-title>
              {{ addNewLabelText }}
            </template>
            <slot name="modal-content" />
            <template v-slot:modal-footer="{ ok, cancel }">
              <b-button
                type="reset"
                variant="link"
                @click="cancel()"
                class="text-decoration-none font-weight-500 mr-2"
                >{{ $t("peruuta") }}</b-button
              >
              <b-button variant="primary" @click="ok()">{{
                $t("lisaa")
              }}</b-button></template
            ></b-modal
          ><span>{{ $t("tai-valitse-alta") }} </span>
        </div>
      </div></template
    ><slot
  /></b-form-group>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { confimExit } from "@/utils/confirm";

@Component({})
export default class ElsaFormGroup extends Vue {
  @Prop({ required: true, type: String })
  label!: string;

  @Prop({ required: false, type: String })
  labelFor!: string;

  @Prop({ required: false, type: String })
  addNewLabel!: string;

  @Prop({ required: false, type: Function })
  addNew!: () => void;

  @Prop({ required: false, type: Boolean, default: false })
  required!: boolean;

  async hideConfirm(event: any) {
    // Tarkista, onko poistuminen jo vahvistettu
    if (event.trigger !== "confirm") {
      event.preventDefault();
    } else {
      return;
    }

    if (event.trigger === "ok") {
      // TODO: Välitä sisällön data vanhemmalle
      await this.addNew();
      (this.$refs[this.modalRef] as any).hide("confirm");
    } else {
      // Pyydä poistumisen vahvistus
      if (await confimExit(this)) {
        (this.$refs[this.modalRef] as any).hide("confirm");
      }
    }
  }

  get addNewLabelText() {
    return this.addNewLabel ? this.addNewLabel : this.$t("lisaa-uusi");
  }

  get modalRef() {
    return `elsa-form-group-modal-${(this as any)._uid}`;
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";

.form-group-help {
  font-size: $font-size-sm;
}
</style>