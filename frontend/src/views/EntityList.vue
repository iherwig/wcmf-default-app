<template>
  <h1>{{ $t(`${type} [Pl.]`) }}</h1>
  <component :is="entityTabs" :selectedTab="type">
    <component :is="entityList" v-if="typeClass"
      :type="typeClass"
      :actions="actions"
      :enabledFeatures="[]"
      :data="entities"
    />
  </component>
</template>

<script lang="ts" setup>
import { inject, ref, watch, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { EntityListInjectionKey, EntityTabsInjectionKey } from '~/keys'
import { useModel } from '~/composables/model'
import EntityTabs from '~/components/data/EntityTabs.vue'
import EntityList from '~/components/data/EntityList.vue'
import { EntityType } from '~/stores/model/meta/types'
import { useEntityStore } from '~/stores'
import { Action, Edit } from '~/actions'

const props = defineProps<{
  type: string
}>()

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)
const entityList = inject(EntityListInjectionKey, EntityList)

const { locale } = useI18n()
const model = useModel()

const typeClass = ref<EntityType>()

const entityStore = useEntityStore(locale, typeClass)
const entities = storeToRefs(entityStore).entities

const actions = computed<Action<unknown>[]>(() => [
  new Edit()
])

const handleTypeChange = async(type: string) => {
  typeClass.value = model.getType(type)
  if (typeClass.value) {
    entities.value = []
    await entityStore.fetch()
  }
}

onMounted(() => {
  handleTypeChange(props.type)
})
watch(props, () => {
  handleTypeChange(props.type)
})
</script>