<template>
  <div class="itsearviointi">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("tee-itsearviointi") }}</h1>
          <hr />
          <arviointi-form
            v-if="value"
            :value="value"
            @submit="onSubmit"
            :editing="true"
            :itsearviointi="true"
          />
          <div class="text-center" v-else>
            <b-spinner variant="primary" :label="$t('ladataan')"></b-spinner>
          </div>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { confimExit } from "@/utils/confirm";
import { toastFail } from "@/utils/toast";
import ArviointiForm from "@/forms/arviointi-form.vue";

@Component({
  components: {
    ArviointiForm
  }
})
export default class Itsearviointi extends Vue {
  value = null;
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("arvioinnit"),
      to: { name: "arvioinnit" }
    },
    {
      text: this.$t("tee-itsearviointi"),
      active: true
    }
  ];
  saved = false;

  async mounted() {
    if (this.$route && this.$route.params && this.$route.params.arviointiId) {
      this.value = (
        await axios.get(
          `erikoistuva-laakari/suoritusarvioinnit/${this.$route.params.arviointiId}`
        )
      ).data;
    }
  }

  async onSubmit(value: any) {
    try {
      await axios.put("erikoistuva-laakari/suoritusarvioinnit", value);
      this.saved = true;
      this.$router.push({ name: "itsearviointi-valmis" });
    } catch (err) {
      toastFail(this, this.$t("itsearvioinnin-tallentaminen-epaonnistui"));
    }
  }

  async beforeRouteLeave(to: any, from: any, next: any) {
    try {
      if (this.saved || (await confimExit(this))) {
        next();
      } else {
        next(false);
      }
    } catch (err) {
      next(false);
    }
  }
}
</script>

<style lang="scss" scoped>
.itsearviointi {
  max-width: 970px;
}
</style>
