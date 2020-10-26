<template>
  <div class="arviointipyynto">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <b-card-skeleton
            :loading="false"
            class="mb-3 arviointipyynto-card"
            :header="$t('pyyda-arviointia')"
          >
            <arviointipyynto-form
              @submit="onSubmit"
              :tyoskentelyjaksot="tyoskentelyjaksot"
              :kouluttajat="kouluttajat"
            />
          </b-card-skeleton>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import store from "@/store";
import { confimExit } from "@/utils/confirm";
import { ArviointipyyntoLomake } from "@/types";
import BCardSkeleton from "@/components/card/card.vue";
import ArviointipyyntoForm from "@/forms/arviointipyynto-form.vue";

Component.registerHooks(["beforeRouteLeave"]);

@Component({
  components: {
    BCardSkeleton,
    ArviointipyyntoForm
  }
})
export default class Arviointipyynto extends Vue {
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
      text: this.$t("pyyda-arviointia"),
      active: true
    }
  ];
  saved = false;
  arviointipyyntoLomake: null | ArviointipyyntoLomake = null;

  mounted() {
    this.fetch();
  }

  async fetch() {
    try {
      this.arviointipyyntoLomake = (
        await axios.get(
          `erikoistuva-laakari/${store.getters.account.erikoistuvaLaakari.id}/arviointipyynto-lomake`
        )
      ).data;
    } catch (err) {
      this.arviointipyyntoLomake = {
        tyoskentelyjaksot: [],
        kouluttajat: []
      };
    }
  }

  async onSubmit(value: any) {
    await axios.post("suoritusarvioinnit/arviointipyynto", value);
    this.saved = true;
    this.$router.push({ name: "arviointipyynto-lahetetty" });
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

  get tyoskentelyjaksot() {
    if (this.arviointipyyntoLomake) {
      return this.arviointipyyntoLomake.tyoskentelyjaksot;
    } else {
      return [];
    }
  }

  get kouluttajat() {
    if (this.arviointipyyntoLomake) {
      return this.arviointipyyntoLomake.kouluttajat;
    } else {
      return [];
    }
  }
}
</script>

<style lang="scss" scoped>
.arviointipyynto-card {
  max-width: 970px;
}
</style>
