<template>
  <div class="d-flex-column">
    <b-row class="mb-3">
      <b-col>
        <div class="d-inline-flex">
          <font-awesome-icon
            :icon="['fas', 'exclamation-circle']"
            class="text-danger mr-1"
          />
        </div>
        <div class="d-inline-flex">
          <p v-html="$t('koulutussopimus-tila-3')" class="pr-5" />
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ElsaButton variant="primary" class="mb-4">
          {{ $t("viimeistele-koulutussopimus") }}
        </ElsaButton>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ElsaButton from "@/components/button/button.vue";

@Component({
  components: {
    ElsaButton
  }
})
export default class SopimusState3 extends Vue {}
</script>
