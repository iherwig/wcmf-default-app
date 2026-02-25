<template>
  <n-flex justify="space-between">
    <h1>{{ $t(`${type} [Pl.]`) }}</h1>
    <n-flex vertical justify="center">
      <router-link :to='{ name: "Entity", params: { id: "~" } }'>
        <n-button strong secondary type="primary">{{ $t('Create {0}', [$t(type)]) }}</n-button>
      </router-link>
    </n-flex>
  </n-flex>
  <component :is="entityTabs"
    :selectedTab="type"
  >
    <component :is="entityList" v-if="typeClass"
      :type="typeClass"
      :actions="actions"
      :enabledFeatures="[]"
      :data="items"
      :totalCount="totalCount"
      @load-next="loadNext"
    />
  </component>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import { NFlex, NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useInfiniteQuery } from '@pinia/colada'
import { EntityListInjectionKey, EntityTabsInjectionKey } from '~/keys'
import { useModel } from '~/composables/model'
import { Entity, EntityType } from '~/model/meta/types'
import { Action, Edit } from '~/actions'
import { getItemsQuery } from '~/queries/entity'
import EntityTabs from '~/components/data/EntityTabs.vue'
import EntityList from '~/components/data/EntityList.vue'

const props = defineProps<{
  type: string
}>()

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)
const entityList = inject(EntityListInjectionKey, EntityList)

const { locale } = useI18n()
const model = useModel()

const typeClass = computed<EntityType>(() => model.getType(props.type))
const { state, status, loadNextPage } = useInfiniteQuery(getItemsQuery(locale, typeClass))
const items = computed<Entity[]>(() => state?.value.data?.pages.flatMap(page => page.items) ?? [])
const totalCount = computed<number>(() => state?.value.data?.pages.at(-1)?.totalCount ?? 0)

const actions = computed<Action<unknown>[]>(() => [
  new Edit()
])

const loadNext = () => {
  loadNextPage()
}
</script>