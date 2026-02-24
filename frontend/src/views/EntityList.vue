<template>
  <h1>{{ $t(`${type} [Pl.]`) }}</h1>
  <component :is="entityTabs"
    :selectedTab="type">
    <component :is="entityList" v-if="typeClass"
      :type="typeClass"
      :actions="actions"
      :enabledFeatures="[]"
      :data="dataPages.flatMap(page => page.items)"
      :totalCount="dataPages.at(-1)?.totalCount ?? 0"
      @load-next="loadNext"
    />
  </component>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInfiniteQuery } from '@pinia/colada'
import { EntityListInjectionKey, EntityTabsInjectionKey } from '~/keys'
import { useModel } from '~/composables/model'
import EntityTabs from '~/components/data/EntityTabs.vue'
import EntityList from '~/components/data/EntityList.vue'
import { EntityType } from '~/model/meta/types'
import { Action, Edit } from '~/actions'
import { GetItemsResponse } from '~/api'
import { getItemsQuery } from '~/queries/entity'

const props = defineProps<{
  type: string
}>()

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)
const entityList = inject(EntityListInjectionKey, EntityList)

const { locale } = useI18n()
const model = useModel()

const typeClass = computed<EntityType>(() => model.getType(props.type))
const { state, status, loadNextPage } = useInfiniteQuery(getItemsQuery(locale, typeClass))
const dataPages = computed<GetItemsResponse[]>(() => state?.value.data?.pages ?? [])

const actions = computed<Action<unknown>[]>(() => [
  new Edit()
])

const loadNext = () => {
  loadNextPage()
}
</script>