<template>
  <h1>{{ $t('Welcome') }}</h1>
  <h3>{{ $t('Last Updates') }}</h3>
  <EntityList
    style="height:550px; width:calc(100vw - 2*var(--ep-main-padding))"
    :type="historyEntity"
    :columns="columns"
    :store="store"
    :actions="actions"
    :enabledFeatures="[]"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Column } from 'element-plus'
import { Entity } from '~/stores/model/meta/entity'
import { EntityStore, useHistoryStore } from '~/stores'
import { HistoryItem } from '~/stores/model/history'
import { Action, Edit } from '~/actions'

const { t } = useI18n()

const historyEntity = new HistoryItem()
const historyStore = useHistoryStore()
const { entities } = storeToRefs(historyStore)
const { fetch } = historyStore
const store: EntityStore = { entities, fetch }

const columns: Column<Entity>[] = historyEntity.attributes.filter((a) => !a.tags.includes('DATATYPE_IGNORE')).map((a) => {
  return {
    key: a.name,
    dataKey: a.name,
    title: t(a.name),
    width: 0,
    sortable: true,
  }
})
const actions: Action<unknown>[] = [
  new Edit()
]
</script>

<style scoped>
h1 {
  font-size: 63px;
}
</style>