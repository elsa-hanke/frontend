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
            <font-awesome-icon :icon="['far', 'circle']" />
            <font-awesome-icon
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
        <span :id="uid">{{ value.arvioitavaTapahtuma }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('kouluttaja')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <user-avatar :id="uid" displayName="Kouluttaja Kouluttaja" />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('ajankohta')"
      label-cols-md="4"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">{{ value.tapahtumanAjankohta }}</span>
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
    <p v-if="!editing">Todo...</p>
    <b-form-row v-if="editing">
      <elsa-form-group
        :label="$t('vaativuustaso')"
        :required="true"
        help="Todo"
        class="col-lg-6"
      >
        <template v-slot:modal-content>
          <tyoskentelyjakso-form />
        </template>
        <template v-slot="{ uid }">
          <elsa-multiselect
            :id="uid"
            v-model="form.vaativuustaso"
            :options="vaativuustasot"
            label="name"
            track-by="name"
          >
          </elsa-multiselect>
        </template>
      </elsa-form-group>
    </b-form-row>
    <b-form-row v-if="editing">
      <elsa-form-group
        :label="$t('luottamuksen-taso')"
        :required="true"
        class="col-lg-6"
      >
        <template v-slot="{ uid }">
          <b-form-rating
            :id="uid"
            inline
            no-border
            stars="5"
            v-model="form.luottamuksenTaso"
            class="text-star p-0"
          />
        </template>
        <template v-slot:help>
          <b-link v-b-toggle="'arviointi-arviointi-osa-alueittain'">{{
            $t("anna-arviointi-osa-alueittain")
          }}</b-link>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group
      :label="$t('sanallinen-arviointi')"
      :required="true"
      v-if="editing"
    >
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.sanallinenArviointi"
          rows="5"
        ></b-form-textarea>
      </template>
    </elsa-form-group>
    <div class="text-right" v-if="editing">
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
import { Prop } from "vue-property-decorator";
import store from "@/store";
import UserAvatar from "@/components/user-avatar/user-avatar.vue";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaMultiselect from "@/components/multiselect/multiselect.vue";
import TyoskentelyjaksoForm from "@/forms/tyoskentelyjakso-form.vue";

@Component({
  components: {
    ElsaFormGroup,
    ElsaMultiselect,
    TyoskentelyjaksoForm,
    UserAvatar
  }
})
export default class ArviointiForm extends Vue {
  @Prop({ required: false, default: false })
  editing!: boolean;

  @Prop({ required: true })
  value!: any;

  form: any = {
    vaativuustaso: null,
    luottamuksenTaso: null,
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
