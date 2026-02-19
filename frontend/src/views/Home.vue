<template>
  <h1>{{ $t('Welcome') }}</h1>
  <h3>{{ $t('Last Updates') }}</h3>
  <component :is="entityList" v-if="historyClass"
    :type="historyClass"
    :actions="actions"
    :enabledFeatures="[]"
    :data="status === 'success' ? state.data?.items : []"
  />
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'
import { useQuery } from '@pinia/colada'
import { getItemsQuery } from '~/queries/history'
import EntityList from '~/components/data/EntityList.vue'
import { Edit } from '~/actions'
import { useModel } from '~/composables/model'
import { EntityType } from '~/model/meta/types'
import { EntityListInjectionKey } from '~/keys'

const entityList = inject(EntityListInjectionKey, EntityList)

const model = useModel()

const historyClass = ref<EntityType>(model.getType('HistoryItem'))
const { state, status } = useQuery(getItemsQuery)

const actions = [
  new Edit()
]
</script>

<style scoped>
h1 {
  font-size: 63px;
}
</style>