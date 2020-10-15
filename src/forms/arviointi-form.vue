<template>
  <b-form @submit="onSubmit">
    <elsa-form-group
      :label="$t('erikoistuva-laakari')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <user-avatar :id="uid" :displayName="displayName" />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tyoskentelyjakso')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">1 Laaksolahden terveyskeskus</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('epa-osaamisalue')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid"
          >Hoitovastuun siirtäminen
          <font-awesome-layers
            fixed-width
            class="text-primary"
            v-b-popover.hover.top="'Todo'"
          >
            <font-awesome-icon fixed-width :icon="['far', 'circle']" />
            <font-awesome-icon
              fixed-width
              icon="info"
              transform="shrink-8"
            /> </font-awesome-layers
        ></span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('arvioitava-tapahtuma')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">Potilaan siirto</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('kouluttaja')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">Kouluttaja Kouluttaja</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('ajankohta')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">15.10.2020</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('lisatiedot')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">Potilasta siirretty tuoliin ja takaisin.</span>
      </template>
    </elsa-form-group>
    <hr />
    <b-form-row>
      <elsa-form-group
        :label="$t('vaativuustaso')"
        :required="true"
        help="Todo"
        class="col-md-8"
      >
        <template v-slot:modal-content>
          <tyoskentelyjakso-form />
        </template>
        <template v-slot="{ uid }">
          <multiselect
            :id="uid"
            v-model="form.vaativuustaso"
            :options="vaativuustasot"
            :placeholder="$t('valitse')"
            label="name"
            track-by="name"
          >
            <template slot="noResult">
              <div>{{ $t("ei-hakutuloksia") }}</div>
            </template>
            <template slot="noOptions">{{ $t("ei-vaihtoehtoja") }}</template>
          </multiselect>
        </template>
      </elsa-form-group>
    </b-form-row>
    <b-container fluid class="px-0">
      <b-row>
        <b-col>
          <elsa-form-group
            :label="$t('ammatillisuus')"
            :required="true"
            help="Todo"
          >
            <template v-slot="{ uid }">
              <b-form-rating
                :id="uid"
                inline
                no-border
                stars="5"
                :value="form.ammatillisuus"
                class="text-star p-0"
              />
            </template>
          </elsa-form-group>
          <elsa-form-group
            :label="$t('vuorovaikutustaidot')"
            :required="true"
            help="Todo"
          >
            <template v-slot="{ uid }">
              <b-form-rating
                :id="uid"
                inline
                no-border
                stars="5"
                :value="form.vuorovaikutustaidot"
                class="text-star p-0"
              />
            </template>
          </elsa-form-group>
          <elsa-form-group
            :label="$t('yhteistyotaidot')"
            :required="true"
            help="Todo"
          >
            <template v-slot="{ uid }">
              <b-form-rating
                :id="uid"
                inline
                no-border
                stars="5"
                :value="form.yhteistyotaidot"
                class="text-star p-0"
              />
            </template>
          </elsa-form-group>
        </b-col>
        <b-col>
          <elsa-form-group
            :label="$t('johtamistaidot')"
            :required="true"
            help="Todo"
          >
            <template v-slot="{ uid }">
              <b-form-rating
                :id="uid"
                inline
                no-border
                stars="5"
                :value="form.johtamistaidot"
                class="text-star p-0"
              />
            </template>
          </elsa-form-group>
          <elsa-form-group
            :label="$t('terveyden-ja-hyvinvoinnin-edistaminen')"
            :required="true"
            help="Todo"
          >
            <template v-slot="{ uid }">
              <b-form-rating
                :id="uid"
                inline
                no-border
                stars="5"
                :value="form.terveydenJaHyvinvoinninEdistaminen"
                class="text-star p-0"
              />
            </template>
          </elsa-form-group>
          <elsa-form-group
            :label="$t('oma-osaaminen-ja-tiedonhallinta')"
            :required="true"
            help="Todo"
          >
            <template v-slot="{ uid }">
              <b-form-rating
                :id="uid"
                inline
                no-border
                stars="5"
                :value="form.omaOsaaminenJaTiedonhallinta"
                class="text-star p-0"
              />
            </template>
          </elsa-form-group>
        </b-col>
        <b-col>
          <elsa-form-group
            :label="$t('laaketieteellinen-osaaminen')"
            :required="true"
            help="Todo"
          >
            <template v-slot="{ uid }">
              <b-form-rating
                :id="uid"
                inline
                no-border
                stars="5"
                :value="form.laaketieteellinenOsaaminen"
                class="text-star p-0"
              />
            </template>
          </elsa-form-group>
        </b-col>
      </b-row>
    </b-container>
    <elsa-form-group :label="$t('sanallinen-arviointi')">
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.sanallinenArviointi"
          rows="5"
        ></b-form-textarea>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <b-button
        type="reset"
        variant="link"
        :to="{ name: 'arvioinnit' }"
        class="text-decoration-none font-weight-500 mr-2"
        >{{ $t("peruuta") }}</b-button
      >
      <b-button type="submit" variant="primary">{{ $t("laheta") }}</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Multiselect from "vue-multiselect";
import store from "@/store";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";
import kouluttajaForm from "@/forms/kouluttaja-form.vue";

@Component({
  components: {
    ElsaFormGroup,
    kouluttajaForm,
    Multiselect,
    TyoskentelyjaksoForm,
    UserAvatar
  }
})
export default class ArviointiForm extends Vue {
  form = {
    ammatillisuus: null,
    johtamistaidot: null,
    laaketieteellinenOsaaminen: null,
    vuorovaikutustaidot: null,
    terveydenJaHyvinvoinninEdistaminen: null,
    yhteistyotaidot: null,
    omaOsaaminenJaTiedonhallinta: null,
    sanallinenArviointi: null
  };
  vaativuustasot = [];

  onSubmit(event: any) {
    event.preventDefault();
    console.log("onSubmit", this.form);
    this.$emit("submit", this.form);
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

<style lang="scss" scoped></style>
