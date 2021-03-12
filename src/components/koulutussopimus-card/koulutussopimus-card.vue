<template>
  <div
    class="d-flex justify-content-center border rounded pt-3 mb-4"
    @click="changeState(cardState)"
  >
    <div class="container-fluid sopimus-card-container">
      <h2>{{ $t("koulutussopimus") }}</h2>
      <sopimus-state-0 v-if="cardState === 0"></sopimus-state-0>
      <sopimus-state-1 v-if="cardState === 1"></sopimus-state-1>
      <sopimus-state-2 v-if="cardState === 2"></sopimus-state-2>
      <sopimus-state-3 v-if="cardState === 3"></sopimus-state-3>
      <sopimus-state-4 v-if="cardState === 4"></sopimus-state-4>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import SopimusState0 from "./sopimus-state-0.vue";
import SopimusState1 from "./sopimus-state-1.vue";
import SopimusState2 from "./sopimus-state-2.vue";
import SopimusState3 from "./sopimus-state-3.vue";
import SopimusState4 from "./sopimus-state-4.vue";

@Component({
  components: {
    SopimusState0,
    SopimusState1,
    SopimusState2,
    SopimusState3,
    SopimusState4
  }
})
export default class KoulutussopimusCard extends Vue {
  @Prop({ required: false, default: "1" })
  state!: string | undefined;
  // demo for card state
  cardState = 0;
  changeState(a: number) {
    this.cardState = a < 4 ? a + 1 : 0;
    console.log(this.cardState);
  }
}
</script>

<style lang="scss" scoped>
.sopimus-card-container {
  &:hover {
    cursor: pointer;
  }
}
</style>
