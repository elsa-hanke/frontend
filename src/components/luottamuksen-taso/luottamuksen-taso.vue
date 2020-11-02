<template>
  <div>
    <span class="text-size-lg">
      <b-badge pill variant="light">{{ this.value }}</b-badge>
    </span>
    <span>
      {{ tasonKuvaus }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class ElsaLuottamuksenTaso extends Vue {
  @Prop({ required: true })
  value!: number;

  tasot = [
    {
      arvo: 1,
      kuvaus: this.$t("ohjaajan-toiminnan-seuraaminen")
    },
    {
      arvo: 2,
      kuvaus: this.$t("toiminta-suoran-ohjauksen-alaisena")
    },
    {
      arvo: 3,
      kuvaus: this.$t("toiminta-epasuoran-ohjauksen-alaisena")
    },
    {
      arvo: 4,
      kuvaus: this.$t("toiminta-ilman-ohjausta")
    },
    {
      arvo: 5,
      kuvaus: this.$t("toiminta-ohjaajana")
    }
  ];

  get tasonKuvaus() {
    const taso = this.tasot.find(taso => taso.arvo === this.value);
    if (taso) {
      return taso.kuvaus;
    }
    return undefined;
  }
}
</script>
