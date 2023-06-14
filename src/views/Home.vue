<template>
  <el-space :fill="true" wrap>
    <h1>{{ $t('Welcome') }}</h1>
    <EntityList
      style="height:70vh; width:90vw"
      :type="historyEntity"
      :columns="columns"
      :store="store"
      :actions="[]"
      :enabledFeatures="[]"
    />
  </el-space>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Store, useHistoryStore } from '~/stores'
import { HistoryItem } from '~/stores/model/history'

const { t } = useI18n()

const historyEntity = new HistoryItem()
const historyStore = useHistoryStore()
const { entities } = storeToRefs(historyStore)
const { fetch } = historyStore
const store: Store = { entities, fetch }

const columns = historyEntity.attributes.filter((a) => !a.tags.includes('DATATYPE_IGNORE')).map((a) => {
  return {
    key: a.name,
    dataKey: a.name,
    title: t(a.name),
    width: a.name == '_displayValue' ? 700 : 0,
    sortable: true,
  }
})
</script>

<style scoped>
h1 {
  font-size: 63px;
}
</style>