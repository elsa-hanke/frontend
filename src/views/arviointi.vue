<template>
  <div class="arviointi">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <b-card-skeleton
            :loading="false"
            class="mb-3 arviointi-card"
            :header="$t('arviointi')"
          >
            <div v-if="value">
              <arviointi-form
                :value="value"
                @submit="onSubmit"
                :editing="false"
              />
              <hr />
              <p class="text-right text-danger m-0">
                WIP: vain visuaalinen ilme toteutettu
              </p>
              <div class="border-top border-bottom border-danger py-3">
                <h4>{{ $t("kommentit") }}</h4>
                <p>{{ $t("kommentit-kuvaus") }}</p>
                <div class="kommentit d-flex flex-column border-bottom mb-3">
                  <div class="mr-auto">
                    <div class="bg-light kommentti-left px-3 py-2 mb-3 mr-5">
                      <div
                        class="d-flex justify-content-between align-items-center mb-2"
                      >
                        <user-avatar
                          :display-name="value.arvioinninAntaja.nimi"
                        >
                          <template #display-name>
                            {{ value.arvioinninAntaja.nimi }} |
                            <span class="text-size-sm"
                              >19.10.2019 klo 10.24</span
                            >
                          </template>
                        </user-avatar>
                      </div>
                      <span
                        >Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.</span
                      >
                    </div>
                  </div>
                  <div class="ml-auto">
                    <div
                      class="bg-primary kommentti-right px-3 py-2 mb-3 text-white ml-5"
                    >
                      <div
                        class="d-flex justify-content-between align-items-center mb-2"
                      >
                        <user-avatar :display-name="displayName">
                          <template #display-name>
                            {{ displayName }} |
                            <span class="text-size-sm"
                              >19.10.2019 klo 11.36</span
                            >
                          </template>
                        </user-avatar>
                        <b-link class="text-white">{{ $t("muokkaa") }}</b-link>
                      </div>
                      <span
                        >Sed ut perspiciatis unde omnis iste natus error.</span
                      >
                    </div>
                  </div>
                </div>
                <div class="uusi-kommentti">
                  <elsa-form-group :label="$t('uusi-kommentti')">
                    <template v-slot="{ uid }">
                      <b-form-textarea
                        :id="uid"
                        v-model="kommentti"
                        :placeholder="$t('kirjoita-kommenttisi-tahan')"
                        rows="5"
                      ></b-form-textarea>
                    </template>
                  </elsa-form-group>
                  <div class="text-right">
                    <b-button type="submit" variant="primary">{{
                      $t("lisaa-kommentti")
                    }}</b-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center" v-else>
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
          </b-card-skeleton>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import store from "@/store";
import BCardSkeleton from "@/components/card/card.vue";
import ArviointiForm from "@/forms/arviointi-form.vue";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";

@Component({
  components: {
    BCardSkeleton,
    ArviointiForm,
    UserAvatar,
    ElsaFormGroup
  }
})
export default class Arviointi extends Vue {
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
      text: this.$t("arviointi"),
      active: true
    }
  ];
  kommentti = null;

  async mounted() {
    if (this.$route && this.$route.params && this.$route.params.arviointiId) {
      this.value = (
        await axios.get(`suoritusarvioinnit/${this.$route.params.arviointiId}`)
      ).data;
    }
  }

  onSubmit(form: any) {
    console.log(form);
  }

  get account() {
    return store.getters.account;
  }

  get displayName() {
    if (this.account) {
      return `${this.account.firstName} ${this.account.lastName}`;
    } else {
      return "";
    }
  }
}
</script>

<style lang="scss" scoped>
$kommentti-border-radius: 1.25rem;

.arviointi-card {
  max-width: 970px;
}

.kommentit {
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
