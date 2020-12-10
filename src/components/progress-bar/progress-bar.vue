<template>
  <div
    class="progress mb-1"
    :style="`height: 1.5rem; background-color: ${backgroundColor}`"
  >
    <div
      class="progress-bar"
      :style="`width: ${value}%; background-color: ${color}`"
    >
      <span class="position-absolute font-weight-500 px-2">3 kk 2 pv</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class ElsaProgressBar extends Vue {
  @Prop({ required: true })
  value!: number;

  @Prop({ required: false })
  color!: string;

  @Prop({ required: false })
  backgroundColor!: string;
}
</script>
