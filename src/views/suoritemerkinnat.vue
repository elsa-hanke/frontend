<template>
  <div class="suoritemerkinnat">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("suoritemerkinnat") }}</h1>
          <p>{{ $t("suoritemerkinnat-kuvaus") }}</p>
          <elsa-button
            variant="primary"
            :to="{ name: 'uusi-suoritemerkinta' }"
            class="mb-4"
            >{{ $t("lisaa-suoritemerkinta") }}</elsa-button
          >
          <h2>{{ $t("oppimistavoitteet") }}</h2>
          <div v-if="osaamistavoitteet">
            <div
              v-for="(kategoria, index) in oppimistavoitteenKategoriat"
              :key="index"
              class="mb-2"
            >
              <b-table
                :fields="kategoria.fields"
                :items="kategoria.oppimistavoitteet"
              >
                <template #table-colgroup="scope">
                  <col
                    v-for="field in scope.fields"
                    :key="field.key"
                    :style="{ width: field.width }"
                  />
                </template>
                <template #head(luottamuksenTaso)="data">
                  {{ data.label }}
                  <elsa-popover>
                    <template>
                      <h2>{{ $t("luottamuksen-taso") }}</h2>
                      <div
                        v-for="(taso, index) in luottamuksenTasot"
                        :key="index"
                      >
                        <h3>{{ taso.arvo }} {{ $t(taso.nimi) }}</h3>
                        <p>{{ $t(taso.kuvaus) }}</p>
                      </div>
                    </template>
                  </elsa-popover>
                </template>
                <template #cell(nimi)="data">
                  <div class="py-2">
                    {{ data.value
                    }}{{
                      data.item.firstSuoritemerkinta
                        ? ` (${data.item.suoritemerkinnat.length})`
                        : ``
                    }}
                  </div>
                </template>
                <template #cell(luottamuksenTaso)="data">
                  <div v-if="data.item.firstSuoritemerkinta">
                    <elsa-luottamuksen-taso
                      :value="data.item.firstSuoritemerkinta.luottamuksenTaso"
                      class="py-1"
                    />
                    <b-collapse v-model="data.item.open">
                      <div
                        v-for="(suoritemerkinta, index) in data.item
                          .suoritemerkinnatWithoutFirst"
                        :key="index"
                        class="d-inline-flex"
                      >
                        <elsa-luottamuksen-taso
                          :value="suoritemerkinta.luottamuksenTaso"
                          class="py-1"
                        />
                      </div>
                    </b-collapse>
                  </div>
                </template>
                <template #cell(suorituspaiva)="data">
                  <div v-if="data.item.firstSuoritemerkinta">
                    <elsa-button
                      :to="{
                        name: 'suoritemerkinta',
                        params: {
                          suoritemerkintaId: data.item.firstSuoritemerkinta.id
                        }
                      }"
                      variant="link"
                      class="shadow-none"
                      >{{ $date(data.item.firstSuoritemerkinta.suorituspaiva)
                      }}<font-awesome-icon
                        icon="edit"
                        fixed-width
                        class="ml-2"
                      />
                    </elsa-button>
                    <b-collapse v-model="data.item.open">
                      <div
                        v-for="(suoritemerkinta, index) in data.item
                          .suoritemerkinnatWithoutFirst"
                        :key="index"
                        class="d-inline-flex"
                      >
                        <elsa-button
                          v-if="suoritemerkinta.suorituspaiva"
                          :to="{
                            name: 'suoritemerkinta',
                            params: {
                              suoritemerkintaId: suoritemerkinta.id
                            }
                          }"
                          variant="link"
                          class="shadow-none"
                          >{{ $date(suoritemerkinta.suorituspaiva)
                          }}<font-awesome-icon
                            icon="edit"
                            fixed-width
                            class="ml-2"
                          />
                        </elsa-button>
                      </div>
                    </b-collapse>
                  </div>
                </template>
                <template #cell(actions)="data">
                  <div v-if="data.item.firstSuoritemerkinta">
                    <elsa-button
                      variant="link"
                      class="shadow-none text-dark px-0"
                      @click="toggleItem(data.item)"
                    >
                      <font-awesome-icon
                        :icon="data.item.open ? 'chevron-up' : 'chevron-down'"
                        fixed-width
                        size="lg"
                      />
                    </elsa-button>
                  </div>
                </template>
              </b-table>
            </div>
          </div>
          <div class="text-center" v-else>
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import ElsaButton from "@/components/button/button.vue";
import ElsaPopover from "@/components/popover/popover.vue";
import ElsaLuottamuksenTaso from "@/components/luottamuksen-taso/luottamuksen-taso.vue";
import { luottamuksenTasot } from "@/utils/constants";

@Component({
  components: {
    ElsaButton,
    ElsaPopover,
    ElsaLuottamuksenTaso
  }
})
export default class Suoritemerkinnat extends Vue {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("suoritemerkinnat"),
      active: true
    }
  ];
  osaamistavoitteet: any = null;
  luottamuksenTasot = luottamuksenTasot;

  async mounted() {
    const oppimistavoitteet = (
      await axios.get("erikoistuva-laakari/oppimistavoitteet-taulukko")
    ).data;
    this.osaamistavoitteet = oppimistavoitteet;
  }

  get oppimistavoitteenKategoriat() {
    if (this.osaamistavoitteet) {
      const suoritemerkinnatGroupByOppimistavoite = this.osaamistavoitteet.suoritemerkinnat.reduce(
        (result: any, suoritemerkinta: any) => {
          const oppimistavoiteId = suoritemerkinta.oppimistavoite.id;
          if (oppimistavoiteId in result) {
            result[oppimistavoiteId].push(suoritemerkinta);
          } else {
            result[oppimistavoiteId] = [suoritemerkinta];
          }
          return result;
        },
        {}
      );

      return this.osaamistavoitteet.oppimistavoitteenKategoriat.map(
        (kategoria: any) => ({
          ...kategoria,
          fields: [
            {
              key: "nimi",
              label: `${kategoria.nimi} (${(this.$t(
                "toimenpiteita"
              ) as any).toLowerCase()})`,
              width: "45%"
            },
            {
              key: "luottamuksenTaso",
              label: this.$t("luottamuksen-taso"),
              width: "40%"
            },
            {
              key: "suorituspaiva",
              label: this.$t("suorituspaiva"),
              width: "15%"
            },
            {
              key: "actions",
              label: "",
              width: ""
            }
          ],
          oppimistavoitteet: kategoria.oppimistavoitteet.map(
            (oppimistavoite: any) => {
              const suoritemerkinnat = (
                suoritemerkinnatGroupByOppimistavoite[oppimistavoite.id] || []
              )
                .sort(
                  (a: any, b: any) => a.luottamuksenTaso > b.luottamuksenTaso
                )
                .reverse();
              const firstSuoritemerkinta =
                suoritemerkinnat.length > 0 ? suoritemerkinnat[0] : undefined;
              const suoritemerkinnatWithoutFirst = suoritemerkinnat.slice(1);
              return {
                ...oppimistavoite,
                suoritemerkinnat,
                suoritemerkinnatWithoutFirst,
                firstSuoritemerkinta,
                open: false
              };
            }
          )
        })
      );
    }
    return [];
  }

  toggleItem(item: any) {
    item.open = !item.open;
  }
}
</script>

<style lang="scss" scoped>
.suoritemerkinnat {
  max-width: 1024px;
}

::v-deep table {
  td {
    //background: #f5f5f6;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
