<template>
  <div class="arviointipyynto">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="pl-0 pr-0">
          <b-card-skeleton
            :loading="false"
            class="mb-3 arviointipyynto-card"
            :header="$t('pyyda-arviointia')"
            ><b-form @submit="onSubmit">
              <b-form-group label-for="arviointipyynto-erikoistuva-laakari"
                ><template v-slot:label>{{
                  $t("erikoistuva-laakari")
                }}</template
                ><user-avatar
                  id="arviointipyynto-erikoistuva-laakari"
                  :displayName="displayName"
                />
              </b-form-group>
              <b-form-group label-for="arviointipyynto-tyoskentelyjakso"
                ><template v-slot:label
                  ><div
                    class="d-flex justify-content-between align-items-center flex-wrap"
                  >
                    <div class="text-nowrap">
                      {{ $t("tyoskentelyjakso") }}
                      <span class="text-primary">*</span>
                    </div>
                    <div class="text-muted form-group-help">
                      <font-awesome-layers fixed-width>
                        <font-awesome-icon
                          fixed-width
                          :icon="['far', 'circle']"
                        />
                        <font-awesome-icon
                          fixed-width
                          icon="info"
                          transform="shrink-8"
                        />
                      </font-awesome-layers>
                      <a href="#">{{ $t("lisaa-tyoskentelyjakso") }}</a
                      ><span>{{ $t("jos-et-loyda-sita-alta") }} </span>
                    </div>
                  </div></template
                ><b-form-select
                  id="arviointipyynto-tyoskentelyjakso"
                  v-model="form.tyoskentelyjakso"
                  :options="tyoskentelyjaksot"
                  ><template v-slot:first>
                    <b-form-select-option :value="null" disabled>{{
                      $t("valitse")
                    }}</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group label-for="arviointipyynto-epa-osaamisalue"
                ><template v-slot:label
                  ><div class="text-nowrap">
                    {{ $t("epa-osaamisalue") }}
                    <span class="text-primary">*</span>
                  </div></template
                ><b-form-select
                  id="arviointipyynto-epa-osaamisalue"
                  v-model="form.epaOsaamisalue"
                  :options="epaOsaamisalueet"
                  ><template v-slot:first>
                    <b-form-select-option :value="null" disabled>{{
                      $t("valitse")
                    }}</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group label-for="arviointipyynto-arvioitava-tapahtuma"
                ><template v-slot:label
                  ><div class="text-nowrap">
                    {{ $t("arvioitava-tapahtuma") }}
                    <span class="text-primary">*</span>
                  </div></template
                ><b-form-input
                  id="arviointipyynto-arvioitava-tapahtuma"
                  v-model="form.arvioitavaTapahtuma"
                ></b-form-input>
              </b-form-group>
              <b-form-row>
                <b-form-group
                  label-for="arviointipyynto-kouluttaja"
                  class="col-md-8"
                  ><template v-slot:label
                    ><div
                      class="d-flex justify-content-between align-items-center flex-wrap"
                    >
                      <div class="text-nowrap">
                        {{ $t("kouluttaja") }}
                        <span class="text-primary">*</span>
                      </div>
                      <div class="text-muted form-group-help">
                        <font-awesome-layers fixed-width>
                          <font-awesome-icon
                            fixed-width
                            :icon="['far', 'circle']"
                          />
                          <font-awesome-icon
                            fixed-width
                            icon="info"
                            transform="shrink-8"
                          />
                        </font-awesome-layers>
                        <a href="#">{{ $t("lisaa-kouluttaja") }}</a
                        ><span>{{ $t("jos-et-loyda-sita-alta") }} </span>
                      </div>
                    </div></template
                  ><b-form-select
                    id="arviointipyynto-kouluttaja"
                    v-model="form.kouluttaja"
                    :options="kouluttajat"
                    ><template v-slot:first>
                      <b-form-select-option :value="null" disabled>{{
                        $t("valitse")
                      }}</b-form-select-option>
                    </template>
                  </b-form-select>
                </b-form-group>
                <b-form-group
                  label-for="arviointipyynto-ajankohta"
                  class="col-md-4"
                  ><template v-slot:label
                    ><div class="text-nowrap">
                      {{ $t("ajankohta") }} <span class="text-primary">*</span>
                    </div></template
                  ><b-form-datepicker
                    id="arviointipyynto-ajankohta"
                    v-model="form.ajankohta"
                    start-weekday="1"
                    :locale="currentLocale"
                    :placeholder="$t('valitse')"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric'
                    }"
                    :label-help="$t('datepicker-label-help')"
                    :label-no-date-selected="$t('datepicker-no-date-selected')"
                    ><template v-slot:button-content
                      ><font-awesome-icon
                        :icon="['far', 'calendar-alt']"
                        class="text-primary"/></template></b-form-datepicker
                ></b-form-group>
              </b-form-row>
              <b-form-group label-for="arviointipyynto-lisatiedot"
                ><template v-slot:label>{{ $t("lisatiedot") }}</template
                ><b-form-textarea
                  id="arviointipyynto-lisatiedot"
                  v-model="form.lisatiedot"
                  rows="5"
                ></b-form-textarea
              ></b-form-group>
              <div class="text-right">
                <b-button
                  type="reset"
                  variant="link"
                  :to="{ name: 'arvioinnit' }"
                  class="text-decoration-none font-weight-500 mr-2"
                  >{{ $t("peruuta") }}</b-button
                >
                <b-button type="submit" variant="primary">{{
                  $t("laheta")
                }}</b-button>
              </div>
            </b-form>
          </b-card-skeleton>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";
import BCardSkeleton from "@/components/card/card.vue";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";

Component.registerHooks(["beforeRouteLeave"]);

@Component({
  components: {
    "b-card-skeleton": BCardSkeleton,
    "user-avatar": UserAvatar
  }
})
export default class Arviointipyynto extends Vue {
  form = {
    tyoskentelyjakso: null,
    epaOsaamisalue: null,
    arvioitavaTapahtuma: null,
    kouluttaja: null,
    ajankohta: null,
    lisatiedot: null
  };

  tyoskentelyjaksot = [];
  epaOsaamisalueet = [];
  kouluttajat = [];

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

  async beforeRouteLeave(to: any, from: any, next: any) {
    console.log("beforeRouteLeave", to, from);
    try {
      if (
        await this.$bvModal.msgBoxConfirm(
          this.$t("tallentamattomia-tietoja-vahvistus") as string,
          {
            title: this.$t("vahvista-poistuminen-tallentamatta") as string,
            okVariant: "danger",
            okTitle: this.$t("poistu-tallentamatta") as string,
            cancelTitle: this.$t("peruuta") as string,
            hideHeaderClose: false,
            centered: true
          }
        )
      ) {
        next();
      } else {
        next(false);
      }
    } catch (err) {
      next(false);
    }
  }

  onSubmit() {
    console.log("onSubmit", this.form);
  }

  get displayName() {
    const account = store.getters.account;
    if (account) {
      return `${account.firstName} ${account.lastName}`;
    } else {
      return "";
    }
  }

  get currentLocale() {
    return this.$i18n.locale;
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";

.form-group-help {
  font-size: $font-size-sm;
}

.arviointipyynto-card {
  max-width: 970px;
}
</style>
