<template>
  <n-radio-group v-if="!onlyIfMultiple || $i18n.availableLocales.length > 1" v-model:value="$i18n.locale">
    <n-radio-button
      v-for="locale in $i18n.availableLocales"
      :key="`locale-${locale}`"
      :value="locale"
      :label="t(locale)"
    />
  </n-radio-group>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { NRadioGroup, NRadioButton } from 'naive-ui'

const props = defineProps<{
  onlyIfMultiple?: boolean
}>()

const { locale, t } = useI18n()
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