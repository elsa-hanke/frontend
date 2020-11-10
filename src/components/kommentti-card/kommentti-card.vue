<template>
  <div
    class="kommentti"
    :class="{ 'ml-auto': value.self && !editing, 'mr-auto': !value.self }"
  >
    <div :class="selfClass">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <user-avatar :display-name="value.kommentti.kommentoija.nimi">
          <template #display-name>
            {{ value.kommentti.kommentoija.nimi }} |
            <span
              class="text-size-sm"
              v-if="value.kommentti.muokkausaika !== value.kommentti.luontiaika"
              >{{ $t("muokattu") }}
              {{ $datetime(value.kommentti.muokkausaika) }}
            </span>
            <span v-else class="text-size-sm"
              >{{ $datetime(value.kommentti.luontiaika) }}
            </span>
          </template>
        </user-avatar>
        <b-link
          v-if="value.self && !editing"
          @click="startEditing"
          class="text-white ml-3"
          >{{ $t("muokkaa") }}</b-link
        >
      </div>
      <div v-if="!editing">
        <span>{{ value.kommentti.teksti }}</span>
      </div>
      <div v-else>
        <b-form @submit.stop.prevent="onSubmit">
          <elsa-form-group :label="$t('muokkaa-kommenttia')">
            <template v-slot="{ uid }">
              <b-form-textarea
                :id="uid"
                v-model="kommentti.teksti"
                :placeholder="$t('kirjoita-kommenttisi-tahan')"
                rows="5"
              ></b-form-textarea>
            </template>
          </elsa-form-group>
          <div class="text-right">
            <b-button
              type="reset"
              variant="back"
              @click="cancelEditing"
              class="mr-2"
              >{{ $t("peruuta") }}</b-button
            >
            <b-button
              type="submit"
              variant="primary"
              :disabled="!kommentti.teksti || saving"
              >{{ $t("tallenna") }}</b-button
            >
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios from "axios";
import { Prop } from "vue-property-decorator";
import { toastFail } from "@/utils/toast";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";

@Component({
  components: {
    UserAvatar,
    ElsaFormGroup
  }
})
export default class KommenttiCard extends Vue {
  @Prop({ required: true })
  value!: any;

  editing = false;
  kommentti = {
    teksti: null
  } as any;
  saving = false;

  startEditing() {
    this.kommentti.teksti = this.value.kommentti.teksti;
    this.editing = true;
  }

  cancelEditing() {
    this.editing = false;
  }

  async onSubmit() {
    this.saving = true;
    try {
      const kommentti = (
        await axios.put(
          `erikoistuva-laakari/suoritusarvioinnit/${this.value.kommentti.suoritusarviointiId}/kommentti`,
          {
            ...this.value.kommentti,
            teksti: this.kommentti.teksti
          }
        )
      ).data;
      this.value.kommentti = kommentti;
      this.editing = false;
      this.kommentti = {
        teksti: null
      };
    } catch (err) {
      toastFail(this, this.$t("kommentin-muokkaaminen-epaonnistui"));
    }
    this.saving = false;
  }

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