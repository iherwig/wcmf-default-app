<template>
  <h1>{{ $t('Welcome') }}</h1>
  <h3>{{ $t('Last Updates') }}</h3>
  <EntityList
    :type="historyEntity"
    :actions="actions"
    :enabledFeatures="[]"
    :data="entities"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import EntityList from '~/components/data/EntityList.vue'
import { useHistoryStore } from '~/stores'
import { Action, Edit } from '~/actions'
import { useModel } from '~/composables/model'

const model = useModel()

const historyStore = useHistoryStore()
const historyEntity = model.getType('HistoryItem')
const entities = storeToRefs(historyStore).entities
historyStore.fetch()

const actions = computed<Action<unknown>[]>(() => [
  new Edit()
])
</script>

<style scoped>
h1 {
  font-size: 63px;
}
</style>