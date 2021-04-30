<template>
  <div>
    <input
      id="file-upload"
      type="file"
      @change="handleFileChange"
      :disabled="uploading"
      multiple
      hidden
    />
    <label class="mb-4" for="file-upload" :disabled="uploading" v-on="$listeners">
      <slot v-if="!uploading" />
      <span v-else>
        <slot />
        <b-spinner v-if="uploading" small class="ml-2"></b-spinner>
      </span>
    </label>
    <b-alert variant="danger" :show="hasErrors" @dismissed="onDismissAlert" dismissible>
      <div class="d-flex flex-row">
        <em class="align-middle">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2" />
        </em>
        <div v-if="this.filesToUploadCount === 1">
          <h4>
            {{ $t('asiakirjan-tallentaminen-epaonnistui') }}
          </h4>
          <ul>
            <li v-if="duplicateFiles.length > 0">
              {{ $t('asiakirja-samanniminen-tiedosto') }}
            </li>
            <li v-if="filesOfWrongType.length > 0">
              {{ $t('asiakirjan-tiedostuomuoto-vaara') }}
            </li>
            <li v-if="filesExceedingMaxSize.length > 0">
              {{ $t('asiakirjan-maksimi-tiedostokoko-ylitetty') }}
            </li>
          </ul>
        </div>
        <div v-else>
          <h4>
            {{ $t('asiakirjojen-tallentaminen-epaonnistui') }}
          </h4>
          <div class="mb-2" v-if="maxFilesTotalSizeExceeded">
            {{ $t('asiakirjojen-yhteenlaskettu-koko-ylitetty') }}
          </div>
          <span v-if="duplicateFiles.length > 0">
            {{ $t('asiakirja-samanniminen-tiedosto') }}
            <ul>
              <li v-for="(file, index) in duplicateFiles" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
          <span v-if="filesOfWrongType.length > 0">
            {{ $t('asiakirjan-tiedostuomuoto-vaara') }}
            <ul>
              <li v-for="(file, index) in filesOfWrongType" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
          <span v-if="filesExceedingMaxSize.length > 0">
            {{ $t('asiakirjan-maksimi-tiedostokoko-ylitetty') }}
            <ul>
              <li v-for="(file, index) in filesExceedingMaxSize" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
        </div>
      </div>
    </b-alert>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { Prop } from 'vue-property-decorator'
  // Maksimi tiedostokoko 20 Mt
  const maxFileSize = 20 * 1024 * 1024
  const maxFilesTotalSize = 100 * 1024 * 1024

  @Component({})
  export default class ElsaFileUpload extends Vue {
    private filesExceedingMaxSize: File[] = []
    private filesOfWrongType: File[] = []
    private duplicateFiles: File[] = []
    private maxFilesTotalSizeExceeded = false
    private filesToUploadCount = 0

    @Prop({ required: false, default: undefined })
    uploading!: boolean | false

    @Prop({ required: true, default: undefined })
    existingFileNames!: string[]

    handleFileChange(e: Event) {
      const inputElement = e.target as HTMLInputElement
      const fileArray = [...(inputElement?.files ?? [])]
      this.filesToUploadCount = fileArray.length
      // Chromea varten. Muutoin heti perään valittu sama tiedosto ei laukaise koko eventtiä.
      inputElement.value = ''
      this.maxFilesTotalSizeExceeded = this.getIsTotalFileSizeExceeded(fileArray)
      this.filesExceedingMaxSize = this.getFilesExceedingMaxSize(fileArray)
      this.filesOfWrongType = this.getFilesOfWrongType(fileArray)
      this.duplicateFiles = this.getDuplicateFiles(fileArray)

      if (
        !this.maxFilesTotalSizeExceeded &&
        this.filesExceedingMaxSize.length === 0 &&
        this.filesOfWrongType.length === 0 &&
        this.duplicateFiles.length === 0
      ) {
        this.filesToUploadCount = 0
        this.$emit('selected-files', fileArray)
      }
    }

    getIsTotalFileSizeExceeded(files: File[]): boolean {
      return files.reduce((sum: number, current: File) => sum + current.size, 0) > maxFilesTotalSize
    }

    getFilesExceedingMaxSize(files: File[]): File[] {
      return files.filter((file) => file.size > maxFileSize)
    }

    getFilesOfWrongType(files: File[]): File[] {
      return files.filter(
        (file) =>
          file.type !== 'application/pdf' &&
          file.type !== 'image/jpg' &&
          file.type !== 'image/jpeg' &&
          file.type !== 'image/png'
      )
    }

    getDuplicateFiles(files: File[]): File[] {
      return files.filter((file) => this.existingFileNames.indexOf(file.name) >= 0)
    }

    onDismissAlert() {
      this.filesExceedingMaxSize = []
      this.filesOfWrongType = []
      this.duplicateFiles = []
    }

    get hasErrors() {
      return (
        this.maxFilesTotalSizeExceeded ||
        this.filesExceedingMaxSize.length !== 0 ||
        this.filesOfWrongType.length !== 0 ||
        this.duplicateFiles.length !== 0
      )
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  label {
    color: $white;
    background-color: $primary;
    border-color: $primary;
    display: inline-block;
    font-weight: 500;
    border: 2px solid transparent;
    padding: 0.375rem 1.6rem;
    border-radius: 50rem;
    &[disabled] {
      opacity: 0.6;
    }
    &:hover,
    &:active {
      &:not([disabled]) {
        background-color: darken($primary, 15);
        cursor: pointer;
      }
    }
  }
</style>
