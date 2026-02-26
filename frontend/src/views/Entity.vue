<template>
  <n-flex justify="space-between">
    <h1>{{ title }}</h1>
    <n-flex vertical justify="center">
      <n-button strong secondary type="primary">{{ $t('Save') }}</n-button>
    </n-flex>
  </n-flex>
  <component :is="entityTabs" v-if="entity"
    :selectedTab="oid"
    @tab-changed="tabChanged"
  >
    <n-spin size="medium" :show="tabSwitching || loading">
      <component :is="entityForm"
        :entity="entity"
      />
    </n-spin>
  </component>
</template>

<script lang="ts" setup>
import { inject, computed, ref, nextTick, watch, onMounted } from 'vue'
import { NFlex, NButton, NSpin } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { EntityTabsInjectionKey } from '~/keys'
import { useModel } from '~/composables/model'
import { Entity, EntityType } from '~/model/meta/types'
import { getItemQuery } from '~/queries/entity'
import { useQuery } from '@pinia/colada'
import EntityTabs from '~/components/data/EntityTabs.vue'
import EntityForm from '~/components/data/EntityForm.vue'

const props = defineProps<{
  type: string
  id: string
}>()

const entityTabs = inject(EntityTabsInjectionKey, EntityTabs)
const entityForm = inject(EntityTabsInjectionKey, EntityForm)

const { locale } = useI18n()
const model = useModel()

const typeClass = computed<EntityType>(() => model.getType(props.type))
const oid = computed<string>(() => model.getOid(props.type, props.id))

const entity = ref<Entity>()
const title = computed<string>(() => typeClass.value.getSummary(entity.value))
const loading = ref<boolean>(false)
const tabSwitching = ref<boolean>(false)

const tabChanged = async () => {
  tabSwitching.value = true

  await nextTick()
  await new Promise(r => setTimeout(r, 20))

  tabSwitching.value = false
}

const loadEntity = async () => {
  if (!model.isDummyOid(oid.value)) {
    loading.value = true
    await nextTick()
    const query = useQuery(getItemQuery(locale, typeClass, ref(props.id)))
    await query.refresh()
    loading.value = false
    if (query.state?.value.data) {
      entity.value = query.state?.value.data
    }
  }
  if (!entity.value) {
    entity.value = { oid: oid.value }
  }
}

watch(props, () => {
  loadEntity()
})

onMounted(() => {
  loadEntity()
})
</script>