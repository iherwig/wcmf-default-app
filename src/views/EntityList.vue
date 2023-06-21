<template>
  <el-space :fill="true" wrap>
    <h1>{{ $t(`${type} [Pl.]`) }}</h1>
    <component :is="entityTabs" :selectedTab="type"
      style="height:75vh; width:90vw"
    >
      <EntityList
        :type="typeClass"
        :columns="columns"
        :store="store"
        :actions="actions"
        :enabledFeatures="[]"
      />
    </component>
  </el-space>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Column } from 'element-plus'
import { EntityTabsInjectionKey } from '~/keys'
import EntityTabs from '~/components/data/EntityTabs.vue'
import { Model, Entity } from '~/stores/model/meta'
import { EntityStore, useEntityStore } from '~/stores'
import { Action, Edit } from '~/actions'

const props = defineProps<{ type: string }>()
console.log(props.type)

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)

const { locale, t } = useI18n()

const typeClass = Model.getType(props.type)
const entityStore = useEntityStore(locale.value, typeClass)
const { entities } = storeToRefs(entityStore)
const { fetch } = entityStore
const store: EntityStore = { entities, fetch }
const columns: Column<Entity>[] = typeClass.attributes.filter((a) => !a.tags.includes('DATATYPE_IGNORE')).map((a) => {
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