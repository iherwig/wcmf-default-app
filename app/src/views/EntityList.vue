<template>
  <el-space :fill="true" wrap>
    <h1>{{ $t(`${type} [Pl.]`) }}</h1>
    <component :is="entityTabs" :selectedTab="type"
      style="height:75vh; width:90vw"
    >
      <EntityList v-if="typeClass"
        :type="typeClass"
        :columns="columns"
        :actions="actions"
        :store="store"
        :enabledFeatures="[]"
      />
    </component>
  </el-space>
</template>

<script lang="ts" setup>
import { inject, ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Column } from 'element-plus'
import { EntityTabsInjectionKey } from '~/keys'
import { useModel } from '~/composables/model'
import { useNotification } from '~/composables/notification'
import EntityTabs from '~/components/data/EntityTabs.vue'
import EntityList from '~/components/data/EntityList.vue'
import { Entity, EntityType } from '~/stores/model/meta/types'
import { EntityStore, useEntityStore } from '~/stores'
import { Action, Edit } from '~/actions'

const props = defineProps<{
  type: string
}>()

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)

const { locale, t } = useI18n()
const { showNotification } = useNotification()
const model = useModel()

const typeClass = ref<EntityType>()
const columns = ref<Column<Entity>[]>()
const actions = ref<Action<unknown>[]>()
const store = ref<EntityStore>()

const handleTypeChange = () => {
  typeClass.value = model.getType(props.type)
  if (!typeClass.value) {
    showNotification({ type: 'error', title: 'Error', text: `Unknown type "${props.type}"` })
  }
  else {
    const entityStore = useEntityStore(locale.value, typeClass.value)
    const { entities } = storeToRefs(entityStore)
    const { fetch } = entityStore

    columns.value = typeClass?.value.attributes.filter((a) => !a.tags.includes('DATATYPE_IGNORE')).map((a) => {
      return {
        key: a.name,
        dataKey: a.name,
        title: t(a.name),
        width: 0,
        sortable: true,
      }
    })
    actions.value = [
      new Edit()
    ]
    store.value = { entities, fetch }
  }
}

onMounted(() => {
  handleTypeChange()
})
watch(props, () => {
  handleTypeChange()
})
</script>