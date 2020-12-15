<template>
  <div>
    <h3>{{ $t("poissaolon-syy") }}</h3>
    <p>
      {{ newInfo ? $t("valitse-listasta-poissaolon-syy") : "" }}
      {{ $t("poissaolon-syy-kuvaus") }}
    </p>
    <h4>
      {{ $t("koulutuskertymaa-vahentavat-poissaolot") }}
    </h4>
    <p>
      {{ $t("koulutuskertymaa-vahentavat-kuvaus") }}
    </p>
    <ul>
      <li v-for="(syy, index) in vahennetaanSuoraan" :key="index">
        {{ syy.nimi }}
      </li>
    </ul>
    <h4>
      {{ $t("koulutuskertymaa-vahentavat-poissaolot-yli-30-pv-poissaoloissa") }}
    </h4>
    <p>
      {{ $t("koulutuskertymaa-vahentavat-yli-30-pv-kuvaus") }}
    </p>
    <ul>
      <li v-for="(syy, index) in vahennetaanYlimenevaAika" :key="index">
        {{ syy.nimi }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class ElsaPoissaolonSyyt extends Vue {
  @Prop({ required: true })
  value!: [];

  @Prop({ required: false, default: false })
  newInfo!: boolean;

  get vahennetaanYlimenevaAika() {
    return this.value.filter(
      (syy: any) => syy.vahennystyyppi === "VAHENNETAAN_YLIMENEVA_AIKA"
    );
  }

  get vahennetaanSuoraan() {
    return this.value.filter(
      (syy: any) => syy.vahennystyyppi === "VAHENNETAAN_SUORAAN"
    );
  }
}
</script>
