<template>
  <h1>{{ $t('Welcome') }}</h1>
  <h3>{{ $t('Last Updates') }}</h3>
  <component :is="entityList" v-if="historyClass"
    :type="historyClass"
    :actions="actions"
    :enabledFeatures="[]"
    :data="items"
    :totalCount="totalCount"
    :loading="isLoading"
  />
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { useInfiniteQuery } from '@pinia/colada'
import { getItemsQuery } from '~/queries/history'
import { Edit } from '~/actions'
import { useModel } from '~/composables/model'
import { Entity, EntityType } from '~/model/meta/types'
import { EntityListInjectionKey } from '~/keys'
import EntityList from '~/components/data/EntityList.vue'

const entityList = inject(EntityListInjectionKey, EntityList)

const model = useModel()

const historyClass = ref<EntityType>(model.getType('HistoryItem'))
const { state, status, isLoading } = useInfiniteQuery(getItemsQuery)
const items = computed<Entity[]>(() => state?.value.data?.pages.flatMap(page => page.items) ?? [])
const totalCount = computed<number>(() => state?.value.data?.pages.at(-1)?.totalCount ?? 0)

const actions = [
  new Edit()
]
</script>

<style scoped>
h1 {
  font-size: 63px;
}
</style>