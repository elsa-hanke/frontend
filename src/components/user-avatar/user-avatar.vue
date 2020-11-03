<template>
  <div class="d-flex text-nowrap align-items-center">
    <avatar
      v-bind="$attrs"
      :src="imageSrc"
      :username="displayName"
      background-color="gray"
      color="white"
      :size="32"
      class="d-inline-block mr-2 avatar"
      :class="{ 'my-2': title }"
    ></avatar>
    <div>
      <span class="align-middle">{{ displayName }}</span>
      <div class="text-size-sm font-weight-400" v-if="title">{{ title }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Avatar from "vue-avatar";

@Component({
  components: {
    Avatar
  }
})
export default class UserAvatar extends Vue {
  @Prop({ required: true })
  displayName!: string;

  @Prop({ required: false })
  src!: undefined | string;

  @Prop({ required: false })
  srcContentType!: undefined | string;

  @Prop({ required: false })
  srcBase64!: undefined | string;

  @Prop({ required: false, type: String })
  title!: undefined | string;

  get imageSrc() {
    if (this.srcContentType && this.srcBase64) {
      return `data:${this.srcContentType};base64,${this.srcBase64}`;
    } else if (this.src) {
      return this.src;
    } else {
      return undefined;
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  min-width: 32px;
}
</style>
