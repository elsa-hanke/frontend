<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('kayttaja')">
      <template v-slot="{ uid }">
        <user-avatar :id="uid" :displayName="displayName" />
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('valitse-oma-roolisi')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="value.kayttajaryhma"
          :options="kayttajaryhmat"
          label="nimi"
          track-by="nimi"
        >
        </elsa-form-multiselect>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('valitse-oma-yliopistosi')"
      :required="true"
      v-if="isYliopistoRooli"
    >
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="value.yliopisto"
          :options="yliopistot"
          label="nimi"
          track-by="nimi"
        >
        </elsa-form-multiselect>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <b-button type="reset" variant="back" @click="logout()">{{
        $t("peruuta")
      }}</b-button>
      <b-button type="submit" variant="primary" class="ml-2">{{
        $t("jatka")
      }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import store from "@/store";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";

@Component({
  components: {
    ElsaFormGroup,
    ElsaFormMultiselect,
    UserAvatar
  }
})
export default class KayttooikeusForm extends Vue {
  value = {
    kayttajaryhma: null,
    yliopisto: null
  } as any;
  kayttajaryhmat = [
    {
      nimi: this.$t("erikoistuva-laakari"),
      arvo: "GROUP_ERIKOISTUVA_LAAKARI"
    },
    {
      nimi: this.$t("lahikouluttaja"),
      arvo: "GROUP_LAHIKOULUTTAJA"
    },
    {
      nimi: this.$t("kouluttaja"),
      arvo: "GROUP_KOULUTTAJA"
    },
    {
      nimi: this.$t("vastuuhenkilo"),
      arvo: "GROUP_VASTUUHENKILO"
    }
  ];
  yliopistot = [
    {
      nimi: "Yliopisto 1",
      arvo: "1"
    },
    {
      nimi: "Yliopisto 2",
      arvo: "2"
    },
    {
      nimi: "Yliopisto 3",
      arvo: "3"
    },
    {
      nimi: "Yliopisto 4",
      arvo: "4"
    },
    {
      nimi: "Yliopisto 5",
      arvo: "5"
    }
  ];

  async logout() {
    await store.dispatch("logout");
  }

  onSubmit() {
    this.$emit("submit", {
      kayttajaryhma: this.value.kayttajaryhma?.arvo,
      yliopisto: this.value.yliopisto?.arvo
    });
  }

  get isYliopistoRooli() {
    if (
      this.value.kayttajaryhma &&
      (this.value.kayttajaryhma.arvo === "GROUP_ERIKOISTUVA_LAAKARI" ||
        this.value.kayttajaryhma.arvo === "GROUP_VASTUUHENKILO")
    ) {
      return true;
    }
    return false;
  }

  get displayName() {
    const account = store.getters.account;
    if (account) {
      return `${account.firstName} ${account.lastName}`;
    } else {
      return "";
    }
  }
}
</script>
