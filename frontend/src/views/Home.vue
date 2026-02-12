<template>
  <h1>{{ $t('Welcome') }}</h1>
  <h3>{{ $t('Last Updates') }}</h3>
  <EntityList
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
import { DataTableColumn } from 'naive-ui'
import EntityList from '~/components/data/EntityList.vue'
import { Entity } from '~/stores/model/meta/types'
import { EntityStore, useHistoryStore } from '~/stores'
import { Action, Edit } from '~/actions'
import { useModel } from '~/composables/model'

const { t } = useI18n()
const model = useModel()

const historyStore = useHistoryStore()
const historyEntity = model.getType('HistoryItem')
const { entities } = storeToRefs(historyStore)
const { fetch } = historyStore
const store: EntityStore = { entities, fetch }

const columns: DataTableColumn<Entity>[] = historyEntity.attributes.filter((a) => !a.tags.includes('DATATYPE_IGNORE')).map((a) => {
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