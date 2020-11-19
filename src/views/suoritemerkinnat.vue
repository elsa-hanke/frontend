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
                responsive
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
                  <div>
                    {{ data.value
                    }}{{
                      data.item.firstSuoritemerkinta
                        ? ` (${data.item.suoritemerkinnat.length})`
                        : ``
                    }}
                  </div>
                </template>
                <template #cell(luottamuksenTaso)="data">
                  <elsa-luottamuksen-taso
                    v-if="data.item.firstSuoritemerkinta"
                    :value="data.item.firstSuoritemerkinta.luottamuksenTaso"
                  />
                </template>
                <template #cell(suorituspaiva)="data">
                  <elsa-button
                    v-if="data.item.firstSuoritemerkinta"
                    :to="{
                      name: 'suoritemerkinta',
                      params: {
                        suoritemerkintaId: data.item.firstSuoritemerkinta.id
                      }
                    }"
                    variant="link"
                    class="shadow-none"
                    >{{ $date(data.item.firstSuoritemerkinta.suorituspaiva)
                    }}<font-awesome-icon icon="edit" fixed-width class="ml-2" />
                  </elsa-button>
                </template>
                <template #cell(actions)="data">
                  <div
                    v-if="
                      data.item.firstSuoritemerkinta &&
                        data.item.suoritemerkinnatWithoutFirst.length > 0
                    "
                  >
                    <elsa-button
                      variant="link"
                      class="shadow-none text-dark px-0"
                      @click="data.toggleDetails"
                    >
                      <font-awesome-icon
                        :icon="
                          data.item._showDetails ? 'chevron-up' : 'chevron-down'
                        "
                        fixed-width
                        size="lg"
                      />
                    </elsa-button>
                  </div>
                </template>
                <template #row-details="row">
                  <div class="row-details">
                    <b-table-simple borderless class="mb-0">
                      <b-tbody>
                        <b-tr
                          v-for="(suoritemerkinta, index) in row.item
                            .suoritemerkinnatWithoutFirst"
                          :key="index"
                        >
                          <b-td :style="{ width: row.fields[0].width }"></b-td>
                          <b-td :style="{ width: row.fields[1].width }">
                            <elsa-luottamuksen-taso
                              :value="suoritemerkinta.luottamuksenTaso"
                            />
                          </b-td>
                          <b-td :style="{ width: row.fields[2].width }">
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
                          </b-td>
                          <b-td :style="{ width: row.fields[3].width }"></b-td>
                        </b-tr>
                      </b-tbody>
                    </b-table-simple>
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
              width: "424px"
            },
            {
              key: "luottamuksenTaso",
              label: this.$t("luottamuksen-taso"),
              width: "350px"
            },
            {
              key: "suorituspaiva",
              label: this.$t("suorituspaiva"),
              width: "200px"
            },
            {
              key: "actions",
              label: "",
              width: "50px"
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
                firstSuoritemerkinta
              };
            }
          )
        })
      );
    }
    return [];
  }
}
</script>

<style lang="scss" scoped>
.suoritemerkinnat {
  max-width: 1024px;
}

::v-deep table {
  min-width: 1024px;
  thead th {
    border-top: none;
  }
  td {
    padding-top: 0;
    padding-bottom: 0;
    vertical-align: middle;
  }
  .b-table-details td {
    padding-left: 0;
    padding-right: 0;
  }
}

.row-details {
  background: #f5f5f6;
}
</style>
