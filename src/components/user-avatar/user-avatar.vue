<template>
  <div class="d-flex text-nowrap align-items-center">
    <avatar
      :username="displayName"
      background-color="gray"
      color="white"
      :size="32"
      class="d-inline-block mr-2 avatar"
    ></avatar>
    <span class="align-middle">{{ displayName }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Avatar from "vue-avatar";

@Component({
  components: {
    avatar: Avatar
  }
})
export default class UserAvatar extends Vue {
  @Prop({ required: true })
  displayName!: string;
}
</script>

<style lang="scss" scoped>
.avatar {
  min-width: 32px;
}
</style>
