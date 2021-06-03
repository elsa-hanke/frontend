<template>
  <div>
    <div v-if="searchVisible" class="search-box form-group col-xs-12 col-sm-6 col-xl-4 p-0">
      <b-form-input
        v-model="hakusana"
        :placeholder="$t('hae-asiakirjoja')"
        class="rounded-pill"
        responsive
      ></b-form-input>
      <font-awesome-icon
        :icon="['fas', 'search']"
        class="text-primary position-absolute search-icon"
      />
    </div>
    <div v-if="!loading">
      <b-alert v-if="showInfoIfEmpty && rows === 0" variant="dark" show>
        <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
        <span v-if="noContentInfoText">
          {{ noContentInfoText }}
        </span>
        <span v-else>
          {{ $t('ei-asiakirjoja') }}
        </span>
      </b-alert>
    </div>
    <div v-else class="text-center">
      <b-spinner variant="primary" :label="$t('ladataan')" />
    </div>
    <b-table
      class="asiakirjat-table"
      v-if="rows > 0"
      :items="tulokset"
      :fields="computedFields"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      stacked="sm"
    >
      <template #table-colgroup="scope">
        <col v-for="field in scope.fields" :key="field.key" :style="{ width: `${field.width}%` }" />
      </template>
      <template #cell(nimi)="row">
        <elsa-button
          variant="link"
          class="shadow-none p-0"
          @click="onViewAsiakirja(row.item)"
          :loading="row.item.disablePreview"
        >
          {{ row.item.nimi }}
        </elsa-button>
      </template>
      <template #cell(download)="row">
        <elsa-button
          variant="outline-primary"
          class="border-0 p-0"
          @click="onDownloadAsiakirja(row.item)"
          :loading="row.item.disableDownload"
        >
          <font-awesome-icon
            :hidden="row.item.disableDownload"
            :icon="['fas', 'file-download']"
            fixed-width
            size="lg"
          />
        </elsa-button>
      </template>
      <template v-if="enableDelete" #cell(delete)="row">
        <elsa-button
          @click="onDeleteAsiakirja(row.item)"
          variant="outline-primary"
          class="border-0 p-0"
          :loading="row.item.disableDelete"
        >
          <font-awesome-icon
            :hidden="row.item.disableDelete"
            :icon="['far', 'trash-alt']"
            fixed-width
            size="lg"
          />
        </elsa-button>
      </template>
    </b-table>
    <b-pagination
      class="mt-4"
      v-if="paginationEnabled && rows > perPage"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      :prev-text="$t('edellinen')"
      :next-text="$t('seuraava')"
      first-number
      last-number
    ></b-pagination>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import ElsaButton from '@/components/button/button.vue'
  import { Asiakirja } from '@/types'
  import { toastFail } from '@/utils/toast'
  import { saveBlob, fetchAndSaveBlob, openBlob, fetchAndOpenBlob } from '@/utils/blobs'

  @Component({
    components: {
      ElsaButton
    }
  })
  export default class AsiakirjatContent extends Vue {
    private endpointUrl = 'erikoistuva-laakari/asiakirjat/'
    private hakusana = ''
    private currentPage = 1

    @Prop({ required: true, default: undefined })
    asiakirjat!: Asiakirja[]

    @Prop({ required: false, type: String, default: 'lisattypvm' })
    sortBy!: string

    @Prop({ required: false, type: Boolean, default: true })
    sortingEnabled!: boolean

    @Prop({ required: false, type: Boolean, default: true })
    sortDesc!: boolean

    @Prop({ required: false, type: Boolean, default: true })
    paginationEnabled!: boolean

    @Prop({ required: false, type: Number, default: 20 })
    perPage!: number

    @Prop({ required: false, type: Boolean, default: true })
    enableSearch!: boolean

    @Prop({ required: false, type: Boolean, default: true })
    enableDelete!: boolean

    @Prop({ required: false, type: Boolean, default: true })
    showInfoIfEmpty!: boolean

    @Prop({ required: false, type: String, default: undefined })
    noContentInfoText!: string

    @Prop({ required: false, type: Boolean, default: false })
    loading!: boolean

    private fields = [
      {
        key: 'nimi',
        label: this.$t('tiedoston-nimi'),
        class: 'file-name'
      },
      {
        key: 'lisattypvm',
        label: this.$t('lisatty'),
        class: 'created-date',
        sortable: this.sortingEnabled,
        width: 10,
        formatter: (val: string) => {
          return new Date(val).toLocaleDateString(this.$i18n.locale)
        }
      },
      {
        key: 'download',
        label: '',
        width: 5,
        class: this.enableDelete ? 'download-btn float-left-xs ' : 'download-btn'
      },
      {
        key: 'delete',
        label: '',
        width: 5,
        disabled: !this.enableDelete
      }
    ]

    async onDeleteAsiakirja(asiakirja: Asiakirja) {
      this.$emit('deleteAsiakirja', asiakirja)
    }

    async onViewAsiakirja(asiakirja: Asiakirja) {
      Vue.set(asiakirja, 'disablePreview', true)

      if (asiakirja.id) {
        const success = await fetchAndOpenBlob(asiakirja.id, asiakirja.nimi, this.endpointUrl)
        if (!success) {
          toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
        }
      } else {
        asiakirja.data?.then((data) => openBlob(data, asiakirja.contentType ?? '')) ??
          toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
      }

      Vue.set(asiakirja, 'disablePreview', false)
    }

    async onDownloadAsiakirja(asiakirja: Asiakirja) {
      Vue.set(asiakirja, 'disableDownload', true)
      if (asiakirja.id) {
        const success = await fetchAndSaveBlob(asiakirja.id, asiakirja.nimi, this.endpointUrl)
        if (!success) {
          toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
        }
      } else {
        asiakirja.data?.then((data) =>
          saveBlob(asiakirja.nimi, data, asiakirja.contentType ?? '')
        ) ?? toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
      }
      Vue.set(asiakirja, 'disableDownload', false)
    }

    get tulokset() {
      if (this.hakusana) {
        this.currentPage = 1
        return this.asiakirjat?.filter((item) =>
          item.nimi.toLowerCase().includes(this.hakusana.toLowerCase())
        )
      }

      return this.asiakirjat
    }

    get rows() {
      return this.tulokset?.length ?? 0
    }

    get searchVisible() {
      return this.enableSearch && this.asiakirjat?.length > 0
    }

    get computedFields() {
      return this.fields.filter((field) => !field.disabled)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~bootstrap/scss/mixins/breakpoints';
  @import '~@/styles/variables';

  .search-box {
    margin: 0.625rem 0 0.25rem 0 !important;

    @include media-breakpoint-down(xs) {
      margin: 0.625rem 0 1rem 0 !important;
    }
  }
</style>

<style lang="scss">
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .asiakirjat-table {
    border-bottom: 0.0625rem solid $gray-300;
    th {
      border-top: none;
      padding-bottom: 0.375rem;
      font-weight: normal;
    }

    td {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      vertical-align: middle;

      &.file-name {
        button {
          word-break: break-all;
          text-align: justify;
        }
      }
    }
  }

  @include media-breakpoint-down(xs) {
    .asiakirjat-table {
      border-bottom: none;
      tr {
        padding: 0.375rem 0 0.375rem 0;
        border: 0.0625rem solid $gray-300;
        border-radius: 0.25rem;
        margin-bottom: 0.375rem;
      }

      td {
        padding: 0.25rem 0 0.25rem 0.25rem;
        &.file-name {
          > div {
            width: 100% !important;
            padding: 0 0.375rem 0 0.375rem !important;
          }
          &::before {
            display: none;
          }
        }
        &.created-date::before {
          text-align: left !important;
          padding-left: 0.375rem !important;
          font-weight: 500 !important;
          width: 100% !important;
        }
        &.download-btn {
          width: 2rem;
          > div {
            padding: 0 0 0 0.25rem !important;
          }
        }
        border: none;
      }
    }
    .float-left-xs {
      float: left;
    }
  }
</style>
