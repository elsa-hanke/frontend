<template>
  <div>
    <multiselect
      :id="id"
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="placeholderText"
      :tagPlaceholder="tagPlaceholderText"
      :selectLabel="selectLabelText"
      :selectGroupLabel="selectGroupLabelText"
      :selectedLabel="selectedLabelText"
      :deselectLabel="deselectLabelText"
      :deselectGroupLabel="deselectGroupLabelText"
      :max="max"
      :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
    >
      <template slot="maxElements">{{
        $t("valittuna-enimmäismaara", { max })
      }}</template>
      <template slot="noResult">{{ $t("ei-hakutuloksia") }}</template>
      <template slot="noOptions">{{ $t("ei-vaihtoehtoja") }}</template>
      <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
        <slot :name="name" v-bind="data"></slot>
      </template>
    </multiselect>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Multiselect from "vue-multiselect";

@Component({
  components: {
    Multiselect
  }
})
export default class ElsaMultiselect extends Vue {
  @Prop({ required: false, type: String })
  id!: string | undefined;

  @Prop({ required: false, type: String })
  placeholder!: string | undefined;

  @Prop({ required: false, type: String })
  tagPlaceholder!: string | undefined;

  @Prop({ required: false, type: String })
  selectLabel!: string | undefined;

  @Prop({ required: false, type: String })
  selectGroupLabel!: string | undefined;

  @Prop({ required: false, type: String })
  selectedLabel!: string | undefined;

  @Prop({ required: false, type: String })
  deselectLabel!: string | undefined;

  @Prop({ required: false, type: String })
  deselectGroupLabel!: string | undefined;

  @Prop({ required: false, type: Number })
  max!: number | undefined;

  @Prop({ required: false })
  state!: boolean | undefined;

  get isValid() {
    return this.state;
  }

  get isInvalid() {
    return this.state === false;
  }

  get placeholderText() {
    return this.placeholder || this.$t("valitse");
  }

  get tagPlaceholderText() {
    return this.tagPlaceholder || this.$t("lisaa-tagi-enter-nappaimella");
  }

  get selectLabelText() {
    return this.selectLabel || this.$t("valitse-enter-nappaimella");
  }

  get selectGroupLabelText() {
    return this.selectGroupLabel || this.$t("valitse-ryhma-enter-nappaimella");
  }

  get selectedLabelText() {
    return this.selectedLabel || this.$t("valittu");
  }

  get deselectLabelText() {
    return this.deselectLabel || this.$t("poista-valinta-enter-nappaimella");
  }

  get deselectGroupLabelText() {
    return (
      this.deselectGroupLabel ||
      this.$t("poista-ryhman-valinta-enter-nappaimella")
    );
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";

::v-deep .multiselect {
  min-height: 35px;

  &.multiselect--disabled {
    background: transparent;
  }

  .multiselect__select {
    height: $font-size-base * $line-height-base + 2 * 0.375rem;

    &::before {
      top: 68%;
    }
  }
  .multiselect__tags {
    padding: 0.375rem 2.5rem 0.375rem 0.75rem;
    border: 1px solid #ced4da;
    min-height: initial;
    .multiselect__spinner {
      right: 5px;
      width: 30px;
      height: $font-size-base * $line-height-base + 2 * 0.375rem;
      &::before {
        border: 0.2em solid $primary;
        border-right-color: transparent;
        animation: spinner-border 0.75s linear infinite;
      }
      &::after {
        display: none;
      }
    }
    .multiselect__single {
      margin: 0;
      padding: 0;
      font-size: $font-size-base;
    }
    .multiselect__option {
      font-size: $font-size-base;
    }
    .multiselect__placeholder {
      font-size: $font-size-base;
      margin: 0;
      padding: 0;
    }
    .multiselect__input {
      font-size: $font-size-base;
      padding: 0;
      margin: 0;
    }
    .multiselect__tag {
      background: $primary;
    }
  }

  .multiselect__content-wrapper {
    font-size: 0.875rem;
    border-color: $gray-400;

    .multiselect__option::after {
      top: 50%;
      transform: translateY(-50%);
    }
    .multiselect__option.multiselect__option--highlight,
    .multiselect__option.multiselect__option--highlight::after {
      background: $primary;
    }
    .multiselect__option.multiselect__option--selected,
    .multiselect__option.multiselect__option--selected::after {
      color: #35495e;
      background: $primary-light;
    }
    .multiselect__option.multiselect__option--highlight.multiselect__option--selected,
    .multiselect__option.multiselect__option--highlight.multiselect__option--selected::after {
      color: white;
      background: $danger;
    }
  }
}

::v-deep .is-invalid .multiselect__content-wrapper {
  border-color: $form-feedback-invalid-color;
}
::v-deep .is-valid .multiselect__content-wrapper {
  border-color: $form-feedback-valid-color;
}

::v-deep .is-invalid .multiselect__tags {
  border-color: $form-feedback-invalid-color;
}
::v-deep .is-valid .multiselect__tags {
  border-color: $form-feedback-valid-color;
}
</style>
