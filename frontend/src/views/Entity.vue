<template>
  <n-flex justify="space-between">
    <h1>{{ title }}</h1>
    <n-flex vertical justify="center">
      <n-button strong secondary type="primary">{{ $t('Save') }}</n-button>
    </n-flex>
  </n-flex>
  <component :is="entityTabs" v-if="entity"
    :selectedTab="entity.oid">
    <div></div>
  </component>
</template>

<script lang="ts" setup>
import { inject, computed, ref } from 'vue'
import { NFlex, NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { EntityTabsInjectionKey } from '~/keys'
import { useModel } from '~/composables/model'
import EntityTabs from '~/components/data/EntityTabs.vue'
import { Entity, EntityType } from '~/model/meta/types'
import { getItemQuery } from '~/queries/entity'
import { useQuery } from '@pinia/colada'

const props = defineProps<{
  type: string
  id: string
}>()

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)
//const entityForm = inject(EntityFormInjectionKey, EntityForm)

const { locale } = useI18n()
const model = useModel()

const typeClass = computed<EntityType>(() => model.getType(props.type))
const { state, status } = useQuery(getItemQuery(locale, typeClass, ref(props.id)))
const entity = computed<Entity>(() => state?.value.data ?? { oid: model.createDummyOid(props.type) })
const title = computed<string>(() => typeClass.value.getSummary(entity.value))
</script>