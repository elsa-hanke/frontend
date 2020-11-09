<template>
  <div
    class="kommentti"
    :class="{ 'ml-auto': value.self, 'mr-auto': !value.self }"
  >
    <div :class="selfClass">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <user-avatar :display-name="value.kommentti.kommentoija.nimi">
          <template #display-name>
            {{ value.kommentti.kommentoija.nimi }} |
            <span class="text-size-sm"
              >{{ $datetime(value.kommentti.luontiaika) }}
              <span
                v-if="
                  value.kommentti.muokkausaika !== value.kommentti.luontiaika
                "
                >({{ $t("muokattu") }}
                {{ $datetime(value.kommentti.muokkausaika) }})
              </span>
            </span>
          </template>
        </user-avatar>
        <b-link v-if="value.self" class="text-white ml-3">{{
          $t("muokkaa")
        }}</b-link>
      </div>
      <span>{{ value.kommentti.teksti }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";

@Component({
  components: {
    UserAvatar
  }
})
export default class KommenttiCard extends Vue {
  @Prop({ required: true })
  value!: any;

  get selfClass() {
    if (this.value.self) {
      return "bg-primary-dark kommentti-right px-3 py-2 mb-3 text-white ml-5";
    } else {
      return "bg-light kommentti-left px-3 py-2 mb-3 mr-5";
    }
  }
}
</script>

<style lang="scss" scoped>
$kommentti-border-radius: 1.25rem;

.kommentti {
  .bg-primary-dark {
    background-color: #0f9bd9;
  }

  .kommentti-left {
    border-top-left-radius: $kommentti-border-radius;
    border-top-right-radius: $kommentti-border-radius;
    border-bottom-right-radius: $kommentti-border-radius;
  }
  .kommentti-right {
    border-top-left-radius: $kommentti-border-radius;
    border-top-right-radius: $kommentti-border-radius;
    border-bottom-left-radius: $kommentti-border-radius;
  }
}
</style>
