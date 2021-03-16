<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('erikoistuva-laakari')">
      <template v-slot="{ uid }">
        <user-avatar :id="uid" />
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('valitse-oma-yliopistosi')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect :id="uid" v-model="value.yliopisto" :options="yliopistot" label="nimi" track-by="nimi"></elsa-form-multiselect>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button variant="back" @click="logout()">{{ $t('peruuta') }}</elsa-button>
      <elsa-button type="submit" :disabled="!value.yliopisto" variant="primary" class="ml-2">{{ $t('jatka') }}</elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import store from '@/store'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormMultiselect,
      UserAvatar,
      ElsaButton
    }
  })
  export default class KayttooikeusForm extends Vue {
    yliopistot = [
      {
        nimi: 'Yliopisto 1',
        arvo: 1
      },
      {
        nimi: 'Yliopisto 2',
        arvo: 2
      },
      {
        nimi: 'Yliopisto 3',
        arvo: 3
      },
      {
        nimi: 'Yliopisto 4',
        arvo: 4
      },
      {
        nimi: 'Yliopisto 5',
        arvo: 5
      }
    ]
    value = {
      yliopisto: null
    } as any

    async logout() {
      await store.dispatch('logout')
    }

    onSubmit() {
      this.$emit('submit', {
        yliopisto: this.value.yliopisto?.arvo
      })
    }
  }
</script>
