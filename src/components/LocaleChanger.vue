<template>
  <select v-if="!onlyIfMultiple || $i18n.availableLocales.length > 1" v-model="$i18n.locale">
    <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ $t(locale) }}</option>
  </select>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

defineProps<{ onlyIfMultiple?: boolean }>();

const { locale } = useI18n()
const router = useRouter()

watch(locale, () => {
  try {
    router.replace({ params: { locale: locale.value } })
  }
  catch(e) {
    console.error(e)
    router.push({ name: 'Root' })
  }
})
</script>