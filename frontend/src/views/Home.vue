<template>
  <h1>{{ $t('Welcome') }}</h1>
  <h3>{{ $t('Last Updates') }}</h3>
  <component :is="entityList" v-if="historyClass"
    :type="historyClass"
    :actions="actions"
    :enabledFeatures="[]"
    :data="dataPages.flatMap(page => page.items)"
    :totalCount="dataPages.pop()?.totalCount ?? 0"
  />
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { useInfiniteQuery } from '@pinia/colada'
import { getItemsQuery } from '~/queries/history'
import EntityList from '~/components/data/EntityList.vue'
import { Edit } from '~/actions'
import { useModel } from '~/composables/model'
import { Entity, EntityType } from '~/model/meta/types'
import { EntityListInjectionKey } from '~/keys'
import { GetItemsResponse } from '~/api'

const entityList = inject(EntityListInjectionKey, EntityList)

const model = useModel()

const historyClass = ref<EntityType>(model.getType('HistoryItem'))
const { state, status } = useInfiniteQuery(getItemsQuery)
const dataPages = computed<GetItemsResponse[]>(() => state?.value.data?.pages ?? [])

const actions = [
  new Edit()
]
</script>

<style scoped>
h1 {
  font-size: 63px;
}
</style>