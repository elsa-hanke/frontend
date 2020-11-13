<template>
  <b-form-datepicker
    v-bind="$attrs"
    v-on="$listeners"
    :id="id"
    :state="state"
    start-weekday="1"
    :locale="currentLocale"
    :min="min"
    :max="max"
    placeholder=""
    :date-format-options="{
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }"
    :label-help="$t('datepicker-label-help')"
    :label-no-date-selected="$t('datepicker-no-date-selected')"
    ><template v-slot:button-content
      ><font-awesome-icon
        :icon="['far', 'calendar-alt']"
        class="text-primary"/></template
  ></b-form-datepicker>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class ElsaFormDatepicker extends Vue {
  @Prop({ required: false, type: String })
  id!: string | undefined;

  @Prop({ required: false, type: Boolean, default: undefined })
  state!: boolean | undefined;

  @Prop({ required: false, type: String })
  min!: string | undefined;

  @Prop({ required: false, type: String })
  max!: string | undefined;

  get currentLocale() {
    if (this.$i18n) {
      return this.$i18n.locale;
    } else {
      return "fi";
    }
  }
}
</script>
