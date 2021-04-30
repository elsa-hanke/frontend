<template>
  <div class="asiakirjat">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('asiakirjat') }}</h1>
          <p>{{ $t('asiakirjat-kuvaus') }}</p>
          <file-upload
            :uploading="uploading"
            :existingFileNames="existingFileNames"
            @selected-files="onAsiakirjatAdded"
          >
            {{ $t('lisaa-asiakirja') }}
          </file-upload>
          <div
            v-if="asiakirjat.length > 0"
            class="search-box form-group col-xs-12 col-sm-6 col-xl-4 p-0"
          >
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
            <b-alert v-if="rows === 0" variant="dark" show>
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              {{ $t('ei-asiakirjoja') }}
            </b-alert>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
          <b-table
            v-if="rows > 0"
            :items="tulokset"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            stacked="sm"
          >
            <template #table-colgroup="scope">
              <col
                v-for="field in scope.fields"
                :key="field.key"
                :style="{ width: `${field.width}%` }"
              />
            </template>
            <template #cell(nimi)="row">
              <elsa-button
                variant="link"
                class="shadow-none p-0"
                @click="onViewAsiakirja(row.item.id, row.item.nimi)"
              >
                {{ row.item.nimi }}
              </elsa-button>
            </template>
            <template #cell(download)="row">
              <elsa-button
                variant="outline-primary"
                class="border-0 p-0"
                @click="onDownloadAsiakirja(row.item.id, row.item.nimi)"
              >
                <font-awesome-icon :icon="['fas', 'file-download']" fixed-width size="lg" />
              </elsa-button>
            </template>
            <template #cell(delete)="row">
              <elsa-button
                @click="onDeleteAsiakirja(row.item.id)"
                variant="outline-primary"
                class="border-0 p-0"
              >
                <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
              </elsa-button>
            </template>
          </b-table>
          <b-pagination
            v-if="rows > perPage"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            :prev-text="$t('edellinen')"
            :next-text="$t('seuraava')"
            first-number
            last-number
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'
  import ElsaButton from '@/components/button/button.vue'
  import FileUpload from '@/components/file-upload/file-upload.vue'
  import { Asiakirja } from '@/types'
  import { toastSuccess, toastFail } from '@/utils/toast'
  import { confirmDelete } from '@/utils/confirm'
  import { previewBlobFile, downloadBlobFile } from '@/utils/blob-files'

  @Component({
    components: {
      FileUpload,
      ElsaButton
    }
  })
  export default class Asiakirjat extends Vue {
    private endpointUrl = 'erikoistuva-laakari/asiakirjat/'
    private asiakirjat: Asiakirja[] = []
    private loading = false
    private uploading = false
    private hakusana = ''
    private sortBy = 'lisattypvm'
    private sortDesc = true
    private perPage = 20
    private currentPage = 1
    private items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('asiakirjat'),
        active: true
      }
    ]
    private fields = [
      {
        key: 'nimi',
        label: this.$t('tiedoston-nimi'),
        class: 'file-name',
        width: 80
      },
      {
        key: 'lisattypvm',
        label: this.$t('lisatty'),
        class: 'created-date',
        sortable: true,
        width: 10,
        formatter: (val: string) => {
          return new Date(val).toLocaleDateString(this.$i18n.locale)
        }
      },
      {
        key: 'download',
        label: '',
        width: 5,
        class: 'download-button'
      },
      {
        key: 'delete',
        label: '',
        width: 5
      }
    ]

    async mounted() {
      await this.fetch()
    }

    async fetch() {
      try {
        this.loading = true
        this.asiakirjat = (await axios.get(this.endpointUrl)).data
      } catch {
        this.$t('asiakirjojen-haku-epaonnistui')
      }
      this.loading = false
    }

    async onAsiakirjatAdded(files: File[]) {
      this.uploading = true

      const formData = new FormData()
      files.forEach((file) => formData.append('files', file, file.name))

      try {
        const asiakirjat = (
          await axios.post(this.endpointUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        ).data
        this.asiakirjat = [...asiakirjat, ...this.asiakirjat]
      } catch (err) {
        toastFail(
          this,
          files.length > 1
            ? this.$t('asiakirjojen-tallentaminen-epaonnistui')
            : this.$t('asiakirjan-tallentaminen-epaonnistui')
        )
        this.uploading = false
        return
      }

      toastSuccess(
        this,
        files.length > 1
          ? this.$t('asiakirjojen-tallentaminen-onnistui')
          : this.$t('asiakirjan-tallentaminen-onnistui')
      )

      this.uploading = false
    }

    async onDeleteAsiakirja(id: number) {
      if (
        await confirmDelete(
          this,
          this.$t('poista-asiakirja') as string,
          (this.$t('asiakirjan') as string).toLowerCase()
        )
      ) {
        try {
          await axios.delete(this.endpointUrl + id)
          toastSuccess(this, this.$t('asiakirjan-poistaminen-onnistui'))
          this.asiakirjat = this.asiakirjat.filter((asiakirja) => asiakirja.id !== id)
        } catch (err) {
          toastFail(this, this.$t('asiakirjan-poistaminen-epaonnistui'))
        }
      }
    }

    async onViewAsiakirja(id: number, nimi: string) {
      console.log(id)
      const success = await previewBlobFile(id, nimi, this.endpointUrl)
      if (!success) {
        toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
      }
    }

    async onDownloadAsiakirja(id: number, nimi: string) {
      const success = await downloadBlobFile(id, nimi, this.endpointUrl)
      if (!success) {
        toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
      }
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
      return this.tulokset?.length
    }

    get existingFileNames() {
      return this.asiakirjat.map((asiakirja) => asiakirja.nimi)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~bootstrap/scss/mixins/breakpoints';
  @import '~@/styles/variables';

  .asiakirjat {
    max-width: 1024px;
  }

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

  .table {
    th {
      border-top: none;
      padding-bottom: 0.25rem;
    }

    td {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;

      &.file-name {
        button {
          word-break: break-all;
          text-align: justify;
        }
      }
      &.created-date {
        padding-top: 0.688rem;
      }
    }
  }

  @include media-breakpoint-down(xs) {
    .table tr {
      padding: 0.375rem 0 0.375rem 0;
      border: 0.0625rem solid $gray-300;
      border-radius: 0.25rem;
      margin-bottom: 0.375rem;
    }

    .table td {
      padding: 0.25rem 0 0.25rem 0.25rem;
      &.file-name {
        button {
          word-break: break-all;
          text-align: justify;
          font-weight: 500;
        }
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
      &.download-button {
        width: 2rem;
        float: left;
        > div {
          padding: 0 0 0 0.25rem !important;
        }
      }
      border: none;
    }
  }
</style>
