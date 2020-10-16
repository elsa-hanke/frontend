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
            ><arviointipyynto-form @submit="onSubmit" />
          </b-card-skeleton>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { confimExit } from "@/utils/confirm";
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

  onSubmit(form: any) {
    console.log(form);
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
}
</script>

<style lang="scss" scoped>
.arviointipyynto-card {
  max-width: 970px;
}
</style>
