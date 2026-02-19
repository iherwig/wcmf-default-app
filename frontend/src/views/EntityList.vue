<template>
  <h1>{{ $t(`${type} [Pl.]`) }}</h1>
  <component :is="entityTabs" :selectedTab="type" @tab-change="handleTypeChange">
    <component :is="entityList" v-if="typeClass"
      :type="typeClass"
      :actions="actions"
      :enabledFeatures="[]"
      :data="status === 'success' ? state?.data?.items : []"
    />
  </component>
</template>

<script lang="ts" setup>
import { inject, ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@pinia/colada'
import { getItemsQuery } from '~/queries/entity'
import { EntityListInjectionKey, EntityTabsInjectionKey } from '~/keys'
import { useModel } from '~/composables/model'
import EntityTabs from '~/components/data/EntityTabs.vue'
import EntityList from '~/components/data/EntityList.vue'
import { EntityType } from '~/model/meta/types'
import { Action, Edit } from '~/actions'

const props = defineProps<{
  type: string
}>()

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)
const entityList = inject(EntityListInjectionKey, EntityList)

const { locale } = useI18n()
const model = useModel()

const typeClass = ref<EntityType>(model.getType(props.type))
const { state, status } = useQuery(getItemsQuery(locale, typeClass))

const actions = computed<Action<unknown>[]>(() => [
  new Edit()
])

const handleTypeChange = async(type: string) => {
  const newType = model.getType(type)
  if (newType && typeClass.value?.typeName != newType.typeName) {
    typeClass.value = newType
  }
}

onMounted(() => {
  handleTypeChange(props.type)
})
watch(props, () => {
  handleTypeChange(props.type)
})
</script>